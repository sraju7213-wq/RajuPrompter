import { runOptimization } from './promptOptimizer';

export type ModelAgentId = 'aurora-loom' | 'silk-oracle' | 'prism-forge' | 'nebula-foundry';

export interface AgentStatus {
  id: ModelAgentId;
  name: string;
  role: string;
  status: 'success' | 'error' | 'skipped' | 'loading';
  summary: string;
}

interface OrchestratorInput {
  prompt: string;
  persona: string;
  tone: string;
  styles: string[];
}

interface OrchestratedData {
  optimizedPrompt: string;
  reasoning: string[];
  checkpoints: string[];
  insights: string[];
  score: number;
  imagePrompt: string;
  agents: AgentStatus[];
}

interface ModelAgentConfig {
  id: ModelAgentId;
  name: string;
  role: string;
  model: string;
  endpoint: string;
  envKey: string;
  fallbackKey?: string;
  temperature?: number;
  maxTokens?: number;
}

interface AgentCallOutcome<T> {
  status: 'success' | 'error' | 'skipped';
  summary: string;
  data: T;
}

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

const AGENT_CONFIG: Record<ModelAgentId, ModelAgentConfig> = {
  'aurora-loom': {
    id: 'aurora-loom',
    name: 'Aurora Loom',
    role: 'Blueprint Weaver',
    model: 'openai/gpt-oss-20b:free',
    endpoint: 'https://openrouter.ai/openai/gpt-oss-20b:free/api',
    envKey: 'VITE_AURORA_LOOM_KEY',
    fallbackKey: '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',
    temperature: 0.7,
    maxTokens: 700,
  },
  'silk-oracle': {
    id: 'silk-oracle',
    name: 'Silk Verse Oracle',
    role: 'Persona Alchemist',
    model: 'qwen/qwen3-4b:free',
    endpoint: 'https://openrouter.ai/qwen/qwen3-4b:free/api',
    envKey: 'VITE_SILK_ORACLE_KEY',
    fallbackKey: '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',
    temperature: 0.6,
    maxTokens: 600,
  },
  'prism-forge': {
    id: 'prism-forge',
    name: 'Prism Forge Architect',
    role: 'Insight Cartographer',
    model: 'google/gemini-2.0-flash-exp:free',
    endpoint: 'https://openrouter.ai/google/gemini-2.0-flash-exp:free/api',
    envKey: 'VITE_PRISM_FORGE_KEY',
    fallbackKey: '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',
    temperature: 0.5,
    maxTokens: 650,
  },
  'nebula-foundry': {
    id: 'nebula-foundry',
    name: 'Nebula Sketch Foundry',
    role: 'Imagery Conductor',
    model: 'x-ai/grok-4-fast:free',
    endpoint: 'https://openrouter.ai/x-ai/grok-4-fast:free/api',
    envKey: 'VITE_NEBULA_FOUNDRY_KEY',
    fallbackKey: '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',
    temperature: 0.8,
    maxTokens: 500,
  },
};

const resolveEnvKey = (envKey: string, fallbackKey?: string): string | undefined => {
  const viteEnv = (import.meta as any)?.env?.[envKey];
  if (viteEnv && typeof viteEnv === 'string' && viteEnv.trim().length > 0) {
    return viteEnv.trim();
  }

  if (typeof process !== 'undefined') {
    const processEnv = (process as any)?.env?.[envKey];
    if (processEnv && typeof processEnv === 'string' && processEnv.trim().length > 0) {
      return processEnv.trim();
    }
  }

  return fallbackKey;
};

const requestOpenRouter = async (
  agent: ModelAgentConfig,
  key: string,
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
): Promise<string> => {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : undefined;
  const timeout = controller ? setTimeout(() => controller.abort(), 25000) : undefined;

  try {
    const response = await fetch(agent.endpoint ?? OPENROUTER_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
        'X-Title': 'Raju Prompter',
        ...(typeof window !== 'undefined' && window.location
          ? { 'HTTP-Referer': window.location.origin }
          : {}),
      },
      body: JSON.stringify({
        model: agent.model,
        messages,
        temperature: agent.temperature ?? 0.7,
        max_tokens: agent.maxTokens ?? 600,
      }),
      signal: controller?.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    const payload = await response.json();
    const content: string | undefined = payload?.choices?.[0]?.message?.content;

    if (!content || typeof content !== 'string') {
      throw new Error('Received empty response content');
    }

    return content.trim();
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
};

const extractJson = <T>(content: string): T | undefined => {
  const codeBlockMatch = content.match(/```json([\s\S]*?)```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1]);
    } catch (error) {
      console.warn('Failed to parse JSON code block', error);
    }
  }

  const firstBrace = content.indexOf('{');
  const lastBrace = content.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1) {
    const jsonSegment = content.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(jsonSegment);
    } catch (error) {
      console.warn('Failed to parse JSON segment', error);
    }
  }

  return undefined;
};

const buildEnrichedPrompt = ({ prompt, persona, tone, styles }: OrchestratorInput): string => {
  const styleDescriptor = styles.length > 0 ? `Blend styles: ${styles.join(', ')}.` : '';
  const personaDescriptor = persona ? `Adopt persona: ${persona}.` : '';
  const toneDescriptor = tone ? `Mood target: ${tone}.` : '';

  return [
    'System: You orchestrate multi-engine prompt weaving with clarity and precision.',
    personaDescriptor,
    toneDescriptor,
    styleDescriptor,
    'Deliver the final prompt after validating coherence, bias safety, and actionable clarity.',
    '',
    prompt,
  ]
    .filter(Boolean)
    .join('\n');
};

const buildReasoningFallback = (prompt: string): string[] => [
  'Clarify intent, deliverables, and timeline expectations.',
  'List inspiration sources, reference styles, and guardrails.',
  'Draft variations across three creativity levels.',
  'Stress test for ambiguity, bias, or missing constraints.',
  `Finalize blueprint: ${prompt.slice(0, 80)}...`,
];

const buildPersonaFallback = ({ persona, tone, styles }: OrchestratorInput): string[] => {
  const notes: string[] = [];
  if (persona) {
    notes.push(`Maintain the ${persona} viewpoint consistently.`);
  } else {
    notes.push('Select a guiding persona to anchor the narrative voice.');
  }
  if (tone) {
    notes.push(`Tune language to feel ${tone}.`);
  } else {
    notes.push('Choose a tonal direction to steer energy and cadence.');
  }
  if (styles.length > 0) {
    notes.push(`Interlace texture cues from ${styles.slice(0, 3).join(', ')}.`);
  } else {
    notes.push('Consider blending two style cues for extra flavor.');
  }
  return notes;
};

const buildImageFallback = ({ prompt, tone, styles }: OrchestratorInput): string => {
  const styleText = styles.length > 0 ? `Style blend: ${styles.join(', ')}.` : 'Style blend: cinematic minimalism.';
  const toneText = tone ? `Atmosphere: ${tone}.` : 'Atmosphere: balanced and inviting.';

  return [
    'Visualize the concept as a high fidelity illustration.',
    styleText,
    toneText,
    `Key brief: ${prompt}`,
  ].join(' \n');
};
const callAurora = async (
  input: OrchestratorInput,
  fallbackPrompt: string,
  fallbackReasoning: string[],
): Promise<AgentCallOutcome<{ basePrompt: string; steps: string[] }>> => {
  const agent = AGENT_CONFIG['aurora-loom'];
  const key = resolveEnvKey(agent.envKey, agent.fallbackKey);
  const fallbackData = { basePrompt: fallbackPrompt, steps: fallbackReasoning };

  if (!key) {
    return {
      status: 'skipped',
      summary: 'Aurora Loom credential missing. Using local weaving heuristics.',
      data: fallbackData,
    };
  }

  try {
    const content = await requestOpenRouter(agent, key, [
      {
        role: 'system',
        content:
          'You are Aurora Loom, a blueprint weaver. Respond in JSON with keys base_prompt, steps (array of 4 short stages), summary. Keep wording under 120 characters per item.',
      },
      {
        role: 'user',
        content: `Original prompt: ${input.prompt}\nPersona: ${input.persona || 'unspecified'}\nTone: ${
          input.tone || 'balanced'
        }\nStyles: ${input.styles.join(', ') || 'none'}\nRebuild the request into a structured production-ready brief.`,
      },
    ]);

    const parsed = extractJson<{ base_prompt?: string; basePrompt?: string; steps?: string[]; summary?: string }>(content);
    if (!parsed || (!parsed.base_prompt && !parsed.basePrompt)) {
      throw new Error('Aurora Loom returned no base_prompt field.');
    }

    return {
      status: 'success',
      summary: parsed.summary ?? 'Aurora Loom rewove the base brief.',
      data: {
        basePrompt: parsed.base_prompt ?? parsed.basePrompt ?? fallbackPrompt,
        steps: Array.isArray(parsed.steps) && parsed.steps.length > 0 ? parsed.steps : fallbackReasoning,
      },
    };
  } catch (error) {
    return {
      status: 'error',
      summary: `Aurora Loom fallback applied: ${(error as Error).message}`,
      data: fallbackData,
    };
  }
};

const callSilk = async (
  input: OrchestratorInput,
  fallbackCheckpoints: string[],
  fallbackPersonaNotes: string[],
): Promise<AgentCallOutcome<{ checkpoints: string[]; personaNotes: string[] }>> => {
  const agent = AGENT_CONFIG['silk-oracle'];
  const key = resolveEnvKey(agent.envKey, agent.fallbackKey);
  const fallbackData = { checkpoints: fallbackCheckpoints, personaNotes: fallbackPersonaNotes };

  if (!key) {
    return {
      status: 'skipped',
      summary: 'Silk Verse Oracle credential missing. Using local persona guidance.',
      data: fallbackData,
    };
  }

  try {
    const content = await requestOpenRouter(agent, key, [
      {
        role: 'system',
        content:
          'You are Silk Verse Oracle, aligning persona, mood, and guardrails. Respond in JSON with keys persona_notes (array of up to 3 tips), checkpoints (array of stage titles), summary.',
      },
      {
        role: 'user',
        content: `Prompt blueprint: ${input.prompt}\nPersona: ${input.persona || 'unspecified'}\nTone: ${
          input.tone || 'balanced'
        }\nStyles: ${input.styles.join(', ') || 'none'}\nOutline voice adjustments and review checkpoints.`,
      },
    ]);

    const parsed = extractJson<{
      persona_notes?: string[];
      personaNotes?: string[];
      checkpoints?: string[];
      summary?: string;
    }>(content);

    if (!parsed) {
      throw new Error('Silk Verse Oracle returned no JSON payload.');
    }

    const personaNotes = Array.isArray(parsed.persona_notes ?? parsed.personaNotes)
      ? (parsed.persona_notes ?? parsed.personaNotes)!.map((note) => String(note)).filter(Boolean)
      : fallbackPersonaNotes;

    const checkpoints = Array.isArray(parsed.checkpoints) && parsed.checkpoints.length > 0
      ? parsed.checkpoints.map((checkpoint) => String(checkpoint)).filter(Boolean)
      : fallbackCheckpoints;

    return {
      status: 'success',
      summary: parsed.summary ?? 'Silk Verse Oracle tuned persona alignment.',
      data: { checkpoints, personaNotes },
    };
  } catch (error) {
    return {
      status: 'error',
      summary: `Silk Verse Oracle fallback applied: ${(error as Error).message}`,
      data: fallbackData,
    };
  }
};

const callPrism = async (
  input: OrchestratorInput,
  fallbackScore: number,
  fallbackInsights: string[],
): Promise<AgentCallOutcome<{ insights: string[]; score: number }>> => {
  const agent = AGENT_CONFIG['prism-forge'];
  const key = resolveEnvKey(agent.envKey, agent.fallbackKey);
  const fallbackData = { insights: fallbackInsights, score: fallbackScore };

  if (!key) {
    return {
      status: 'skipped',
      summary: 'Prism Forge credential missing. Using heuristic scoring.',
      data: fallbackData,
    };
  }

  try {
    const content = await requestOpenRouter(agent, key, [
      {
        role: 'system',
        content:
          'You are Prism Forge Architect, distilling insights and scoring prompt readiness. Respond in JSON with keys insights (array of up to 4 strings), score (0-100), summary.',
      },
      {
        role: 'user',
        content: `Analyze this prompt request: ${input.prompt}\nPersona: ${input.persona || 'unspecified'}\nTone: ${
          input.tone || 'balanced'
        }\nStyles: ${input.styles.join(', ') || 'none'}\nReturn insights focused on clarity, structure, and safeguards.`,
      },
    ]);

    const parsed = extractJson<{ insights?: string[]; score?: number; summary?: string }>(content);
    if (!parsed) {
      throw new Error('Prism Forge returned no JSON payload.');
    }

    const insights = Array.isArray(parsed.insights) && parsed.insights.length > 0
      ? parsed.insights.map((insight) => String(insight)).filter(Boolean)
      : fallbackInsights;

    const score = typeof parsed.score === 'number' ? Math.round(parsed.score) : fallbackScore;

    return {
      status: 'success',
      summary: parsed.summary ?? 'Prism Forge mapped the optimization outlook.',
      data: { insights, score },
    };
  } catch (error) {
    return {
      status: 'error',
      summary: `Prism Forge fallback applied: ${(error as Error).message}`,
      data: fallbackData,
    };
  }
};

const callNebula = async (
  input: OrchestratorInput,
  fallbackImagePrompt: string,
): Promise<AgentCallOutcome<{ imagePrompt: string }>> => {
  const agent = AGENT_CONFIG['nebula-foundry'];
  const key = resolveEnvKey(agent.envKey, agent.fallbackKey);
  const fallbackData = { imagePrompt: fallbackImagePrompt };

  if (!key) {
    return {
      status: 'skipped',
      summary: 'Nebula Sketch credential missing. Using local visual brief.',
      data: fallbackData,
    };
  }

  try {
    const content = await requestOpenRouter(agent, key, [
      {
        role: 'system',
        content:
          'You are Nebula Sketch Foundry, crafting vivid visual prompt lines. Respond in JSON with keys image_prompt (string under 320 characters), summary.',
      },
      {
        role: 'user',
        content: `Transform this idea into a visual brief: ${input.prompt}\nPersona: ${input.persona || 'unspecified'}\nTone: ${
          input.tone || 'balanced'
        }\nStyles: ${input.styles.join(', ') || 'none'}\nDescribe a single image-ready prompt with lens, lighting, and composition hints.`,
      },
    ]);

    const parsed = extractJson<{ image_prompt?: string; imagePrompt?: string; summary?: string }>(content);
    if (!parsed || (!parsed.image_prompt && !parsed.imagePrompt)) {
      throw new Error('Nebula Sketch returned no image_prompt field.');
    }

    return {
      status: 'success',
      summary: parsed.summary ?? 'Nebula Sketch forged an image-ready brief.',
      data: {
        imagePrompt: parsed.image_prompt ?? parsed.imagePrompt ?? fallbackImagePrompt,
      },
    };
  } catch (error) {
    return {
      status: 'error',
      summary: `Nebula Sketch fallback applied: ${(error as Error).message}`,
      data: fallbackData,
    };
  }
};
export const orchestratePrompt = async (input: OrchestratorInput): Promise<OrchestratedData> => {
  const trimmedPrompt = input.prompt.trim();
  const optimization = runOptimization(trimmedPrompt);
  const fallbackPrompt = buildEnrichedPrompt(input);
  const fallbackReasoning = buildReasoningFallback(trimmedPrompt);
  const fallbackPersonaNotes = buildPersonaFallback(input);
  const fallbackImagePrompt = buildImageFallback(input);
  const fallbackCheckpoints = optimization.layers.map((layer) => layer.title);
  const fallbackInsights = optimization.layers.map((layer) => layer.insight);
  const fallbackScore = Math.round(optimization.score);

  const [aurora, silk, prism, nebula] = await Promise.all([
    callAurora(input, fallbackPrompt, fallbackReasoning),
    callSilk(input, fallbackCheckpoints, fallbackPersonaNotes),
    callPrism(input, fallbackScore, fallbackInsights),
    callNebula(input, fallbackImagePrompt),
  ]);

  const optimizedPrompt = aurora.data.basePrompt || fallbackPrompt;
  const reasoning = aurora.data.steps.length > 0 ? aurora.data.steps : fallbackReasoning;
  const checkpoints = silk.data.checkpoints.length > 0 ? silk.data.checkpoints : fallbackCheckpoints;
  const personaNotes = silk.data.personaNotes;
  const prismInsights = prism.data.insights.length > 0 ? prism.data.insights : fallbackInsights;
  const combinedInsights = Array.from(new Set([...personaNotes, ...prismInsights])).slice(0, 8);
  const score = prism.data.score;
  const imagePrompt = nebula.data.imagePrompt || fallbackImagePrompt;

  const agents: AgentStatus[] = [
    {
      id: 'aurora-loom',
      name: AGENT_CONFIG['aurora-loom'].name,
      role: AGENT_CONFIG['aurora-loom'].role,
      status: aurora.status,
      summary: aurora.summary,
    },
    {
      id: 'silk-oracle',
      name: AGENT_CONFIG['silk-oracle'].name,
      role: AGENT_CONFIG['silk-oracle'].role,
      status: silk.status,
      summary: silk.summary,
    },
    {
      id: 'prism-forge',
      name: AGENT_CONFIG['prism-forge'].name,
      role: AGENT_CONFIG['prism-forge'].role,
      status: prism.status,
      summary: prism.summary,
    },
    {
      id: 'nebula-foundry',
      name: AGENT_CONFIG['nebula-foundry'].name,
      role: AGENT_CONFIG['nebula-foundry'].role,
      status: nebula.status,
      summary: nebula.summary,
    },
  ];

  return {
    optimizedPrompt,
    reasoning,
    checkpoints,
    insights: combinedInsights.length > 0 ? combinedInsights : fallbackInsights,
    score,
    imagePrompt,
    agents,
  };
};

export type { OrchestratedData };

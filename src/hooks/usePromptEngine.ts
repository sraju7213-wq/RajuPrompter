import { useEffect, useMemo, useState } from 'react';

import usePromptStore from '../state/usePromptStore';
import { orchestratePrompt, type AgentStatus } from '../utils/modelOrchestrator';

export interface PromptBlueprint {
  optimizedPrompt: string;
  reasoning: string[];
  checkpoints: string[];
  score: number;
  insights: string[];
  imagePrompt: string;
  agents: AgentStatus[];
  isLoading: boolean;
  error?: string;
}

const BASE_AGENTS: AgentStatus[] = [
  {
    id: 'aurora-loom',
    name: 'Aurora Loom',
    role: 'Blueprint Weaver',
    status: 'skipped',
    summary: 'Awaiting prompt input.',
  },
  {
    id: 'silk-oracle',
    name: 'Silk Verse Oracle',
    role: 'Persona Alchemist',
    status: 'skipped',
    summary: 'Awaiting prompt input.',
  },
  {
    id: 'prism-forge',
    name: 'Prism Forge Architect',
    role: 'Insight Cartographer',
    status: 'skipped',
    summary: 'Awaiting prompt input.',
  },
  {
    id: 'nebula-foundry',
    name: 'Nebula Sketch Foundry',
    role: 'Imagery Conductor',
    status: 'skipped',
    summary: 'Awaiting prompt input.',
  },
];

const LOADING_SUMMARIES: Record<string, string> = {
  'aurora-loom': 'Weaving structured blueprint...',
  'silk-oracle': 'Balancing persona cadence...',
  'prism-forge': 'Mapping optimization insights...',
  'nebula-foundry': 'Forging visual brief...',
};

const createEmptyBlueprint = (): PromptBlueprint => ({
  optimizedPrompt: '',
  reasoning: [],
  checkpoints: [],
  score: 0,
  insights: [],
  imagePrompt: '',
  agents: BASE_AGENTS.map((agent) => ({ ...agent })),
  isLoading: false,
  error: undefined,
});

export const usePromptEngine = (): PromptBlueprint => {
  const { prompt, persona, tone, styleFusion } = usePromptStore();
  const [blueprint, setBlueprint] = useState<PromptBlueprint>(() => createEmptyBlueprint());

  useEffect(() => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setBlueprint(createEmptyBlueprint());
      return;
    }

    let cancelled = false;
    setBlueprint((previous) => ({
      ...previous,
      isLoading: true,
      error: undefined,
      agents: previous.agents.map((agent) => ({
        ...agent,
        status: 'loading',
        summary: LOADING_SUMMARIES[agent.id] ?? 'Orchestrating update...',
      })),
    }));

    const handler = setTimeout(() => {
      orchestratePrompt({ prompt: trimmedPrompt, persona, tone, styles: styleFusion })
        .then((result) => {
          if (!cancelled) {
            setBlueprint({
              ...result,
              isLoading: false,
              error: undefined,
            });
          }
        })
        .catch((error: unknown) => {
          if (!cancelled) {
            setBlueprint((previous) => ({
              ...previous,
              isLoading: false,
              error: error instanceof Error ? error.message : 'Unable to orchestrate prompt.',
              agents: previous.agents.map((agent) =>
                agent.status === 'loading'
                  ? {
                      ...agent,
                      status: 'error',
                      summary: 'Fallback heuristics applied.',
                    }
                  : agent,
              ),
            }));
          }
        });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(handler);
    };
  }, [prompt, persona, tone, styleFusion]);

  return useMemo(() => blueprint, [blueprint]);
};

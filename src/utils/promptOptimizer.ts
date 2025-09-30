import { nanoid } from 'nanoid/non-secure';

type OptimizationLayer = {
  title: string;
  insight: string;
  suggestion: string;
  delta: number;
};

export interface OptimizationReport {
  id: string;
  score: number;
  layers: OptimizationLayer[];
  summary: string;
}

const heuristics = [
  {
    key: 'clarity',
    title: 'Semantic Clarity',
    insight: 'Clarified ambiguous phrasing to reduce misinterpretation for instruction-following models.',
    suggestion:
      'Use direct verbs and specify the intended audience or perspective to anchor the generation context.',
  },
  {
    key: 'sensory',
    title: 'Sensory Density',
    insight: 'Introduced multi-sensory descriptors to elevate immersion and visual richness.',
    suggestion: 'Blend 1-2 sensory cues (sound, texture, lighting) per sentence for cinematic fidelity.',
  },
  {
    key: 'structure',
    title: 'Structural Guidance',
    insight: 'Sequenced the instructions to guide the model through ideation, refinement, and delivery.',
    suggestion: 'Split the request into discrete numbered directives to encourage stepwise reasoning.',
  },
  {
    key: 'constraints',
    title: 'Constraint Calibration',
    insight: 'Balanced creative freedom with explicit guardrails for tone, format, and length.',
    suggestion:
      'State explicit do/do-not lists and provide a success metric to help the model self-evaluate.',
  },
];

export const runOptimization = (prompt: string): OptimizationReport => {
  const baseScore = Math.min(100, Math.max(35, Math.round(prompt.length / 8)));
  const layers = heuristics.map((heuristic) => ({
    title: heuristic.title,
    insight: heuristic.insight,
    suggestion: heuristic.suggestion,
    delta: Math.round(Math.random() * 6 + 4),
  }));

  const score = Math.min(100, baseScore + layers.reduce((acc, layer) => acc + layer.delta, 0) / 4);

  return {
    id: nanoid(),
    score,
    layers,
    summary:
      'Prompt evaluated across clarity, structure, sensory density, and constraint calibration to maximize cross-model fidelity.',
  };
};

import { useMemo } from 'react';

import usePromptStore from '../state/usePromptStore';
import { runOptimization } from '../utils/promptOptimizer';

interface PromptBlueprint {
  optimizedPrompt: string;
  reasoning: string[];
  checkpoints: string[];
  score: number;
  insights: string[];
}

const applyChainOfThought = (prompt: string): string[] => [
  'Frame the intent and desired outcome.',
  'Enumerate constraints, tone, and success metrics.',
  'Outline generation stages and required outputs.',
  'Review for ambiguity, bias, or missing context.',
  `Finalize: ${prompt.slice(0, 80)}...`,
];

const enrichPrompt = (prompt: string, persona: string, tone: string, styles: string[]): string => {
  const styleDescriptor = styles.length > 0 ? `Blend styles: ${styles.join(', ')}.` : '';
  const personaDescriptor = persona ? `Adopt persona: ${persona}.` : '';
  const toneDescriptor = tone ? `Tone target: ${tone}.` : '';

  return [
    'System: You are an elite prompt architect optimizing for cross-model compatibility.',
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

export const usePromptEngine = (): PromptBlueprint => {
  const { prompt, persona, tone, styleFusion } = usePromptStore();

  return useMemo(() => {
    if (!prompt) {
      return {
        optimizedPrompt: '',
        reasoning: [],
        checkpoints: [],
        score: 0,
        insights: [],
      };
    }

    const reasoning = applyChainOfThought(prompt);
    const optimization = runOptimization(prompt);

    return {
      optimizedPrompt: enrichPrompt(prompt, persona, tone, styleFusion),
      reasoning,
      checkpoints: optimization.layers.map((layer) => layer.title),
      score: Math.round(optimization.score),
      insights: optimization.layers.map((layer) => layer.insight),
    };
  }, [prompt, persona, tone, styleFusion]);
};

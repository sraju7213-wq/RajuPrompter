import type { PlatformId } from '../state/usePromptStore';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  category: 'text' | 'image' | 'audio' | 'video';
  recommendedLength: string;
  supportsNegativePrompt?: boolean;
  parameters: { key: string; label: string; type: 'slider' | 'text' | 'select'; min?: number; max?: number }[];
  status: 'operational' | 'degraded' | 'outage';
  latencyMs: number;
}

export const PLATFORM_CONFIG: PlatformConfig[] = [
  {
    id: 'aurora-loom',
    name: 'Aurora Loom Blueprint',
    category: 'text',
    recommendedLength: '450-750 tokens',
    parameters: [
      { key: 'temperature', label: 'Temperature', type: 'slider', min: 0, max: 1.2 },
      { key: 'max_tokens', label: 'Max Tokens', type: 'slider', min: 256, max: 1600 },
      { key: 'presence_penalty', label: 'Presence Penalty', type: 'slider', min: -2, max: 2 },
    ],
    status: 'operational',
    latencyMs: 640,
  },
  {
    id: 'silk-oracle',
    name: 'Silk Verse Oracle',
    category: 'text',
    recommendedLength: '300-520 tokens',
    parameters: [
      { key: 'temperature', label: 'Temperature', type: 'slider', min: 0, max: 1 },
      { key: 'top_p', label: 'Top P', type: 'slider', min: 0, max: 1 },
      { key: 'frequency_penalty', label: 'Frequency Penalty', type: 'slider', min: -2, max: 2 },
    ],
    status: 'operational',
    latencyMs: 580,
  },
  {
    id: 'prism-forge',
    name: 'Prism Forge Architect',
    category: 'text',
    recommendedLength: '360-600 tokens',
    parameters: [
      { key: 'temperature', label: 'Temperature', type: 'slider', min: 0, max: 1.5 },
      { key: 'top_k', label: 'Top K', type: 'slider', min: 1, max: 40 },
      { key: 'max_tokens', label: 'Max Tokens', type: 'slider', min: 256, max: 1200 },
    ],
    status: 'degraded',
    latencyMs: 720,
  },
  {
    id: 'nebula-foundry',
    name: 'Nebula Sketch Foundry',
    category: 'image',
    recommendedLength: '50-110 words',
    supportsNegativePrompt: true,
    parameters: [
      { key: 'cfg_scale', label: 'Style Weight', type: 'slider', min: 1, max: 20 },
      { key: 'steps', label: 'Render Steps', type: 'slider', min: 10, max: 50 },
      { key: 'aspect_ratio', label: 'Aspect Ratio', type: 'text' },
    ],
    status: 'operational',
    latencyMs: 410,
  },
];

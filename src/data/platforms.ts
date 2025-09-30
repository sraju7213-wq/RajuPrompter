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
    id: 'openai',
    name: 'OpenAI GPT-4o',
    category: 'text',
    recommendedLength: '600-800 tokens',
    parameters: [
      { key: 'temperature', label: 'Temperature', type: 'slider', min: 0, max: 2 },
      { key: 'top_p', label: 'Top P', type: 'slider', min: 0, max: 1 },
      { key: 'max_tokens', label: 'Max Tokens', type: 'slider', min: 128, max: 4096 },
    ],
    status: 'operational',
    latencyMs: 720,
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude 3.5',
    category: 'text',
    recommendedLength: '400-600 tokens',
    parameters: [
      { key: 'temperature', label: 'Temperature', type: 'slider', min: 0, max: 1 },
      { key: 'max_tokens', label: 'Max Tokens', type: 'slider', min: 128, max: 4096 },
    ],
    status: 'operational',
    latencyMs: 680,
  },
  {
    id: 'gemini',
    name: 'Google Gemini 1.5',
    category: 'text',
    recommendedLength: '450-700 tokens',
    parameters: [
      { key: 'temperature', label: 'Temperature', type: 'slider', min: 0, max: 2 },
      { key: 'topK', label: 'Top K', type: 'slider', min: 1, max: 40 },
    ],
    status: 'degraded',
    latencyMs: 940,
  },
  {
    id: 'midjourney',
    name: 'Midjourney v6',
    category: 'image',
    recommendedLength: '70-120 words',
    supportsNegativePrompt: false,
    parameters: [
      { key: 'stylize', label: 'Stylize', type: 'slider', min: 0, max: 1000 },
      { key: 'chaos', label: 'Chaos', type: 'slider', min: 0, max: 100 },
    ],
    status: 'operational',
    latencyMs: 310,
  },
  {
    id: 'stable-diffusion',
    name: 'Stability AI SDXL',
    category: 'image',
    recommendedLength: '40-80 words',
    supportsNegativePrompt: true,
    parameters: [
      { key: 'cfgScale', label: 'CFG Scale', type: 'slider', min: 1, max: 20 },
      { key: 'steps', label: 'Inference Steps', type: 'slider', min: 10, max: 50 },
    ],
    status: 'operational',
    latencyMs: 420,
  },
  {
    id: 'flux',
    name: 'Flux Pro',
    category: 'image',
    recommendedLength: '60-100 words',
    parameters: [
      { key: 'style', label: 'Style Strength', type: 'slider', min: 0, max: 1 },
    ],
    status: 'operational',
    latencyMs: 390,
  },
  {
    id: 'replicate',
    name: 'Replicate Multimodal',
    category: 'image',
    recommendedLength: '20-60 words',
    parameters: [
      { key: 'guidance', label: 'Guidance Scale', type: 'slider', min: 1, max: 30 },
    ],
    status: 'operational',
    latencyMs: 520,
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Hub',
    category: 'text',
    recommendedLength: 'variable',
    parameters: [
      { key: 'temperature', label: 'Temperature', type: 'slider', min: 0, max: 2 },
    ],
    status: 'degraded',
    latencyMs: 890,
  },
  {
    id: 'open-router',
    name: 'Open Router Multi-Model',
    category: 'text',
    recommendedLength: '420-650 tokens',
    parameters: [
      { key: 'model', label: 'Target Model', type: 'text' },
    ],
    status: 'operational',
    latencyMs: 770,
  },
];

import { motion } from 'framer-motion';
import { AlignLeft, Copy, Flame, Layers, ShieldCheck, Split, Wand2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import usePromptStore from '../state/usePromptStore';
import { usePromptEngine } from '../hooks/usePromptEngine';

const promptTemplates = [
  'Transform this concept into a cinematic narrative blueprint with visual, emotional, and thematic layers.',
  'Design a cross-platform campaign prompt optimized for TikTok, Instagram, and newsletter storytelling.',
  'Craft a multi-shot art prompt blending photoreal portraiture with surreal architectural motifs.',
];

const defaultReasoning = [
  'Clarify ultimate intent and deliverables.',
  'List inspiration sources, reference styles, and guardrails.',
  'Draft candidate prompt variations across three creativity levels.',
  'Simulate response, stress test for bias or ambiguity.',
  'Deliver final prompt with optimization notes and next steps.',
];

const agentStatusStyles: Record<string, string> = {
  success: 'bg-emerald-500/10 text-emerald-300',
  loading: 'bg-primary/10 text-primary',
  error: 'bg-rose-500/10 text-rose-300',
  skipped: 'bg-slate-700/40 text-slate-300',
};

const agentStatusLabels: Record<string, string> = {
  success: 'Ready',
  loading: 'Processing',
  error: 'Fallback',
  skipped: 'Idle',
};

const PromptWorkspace = () => {
  const { prompt, setPrompt, pushHistory } = usePromptStore();
  const [activeTab, setActiveTab] = useState<'composer' | 'chain' | 'audit'>('composer');
  const blueprint = usePromptEngine();
  const chainSteps = blueprint.reasoning.length > 0 ? blueprint.reasoning : defaultReasoning;
  const agentStatuses = blueprint.agents;

  const helperText = useMemo(() => {
    if (!prompt) {
      return 'Start by describing your creative goal, target medium, audience, and success metric.';
    }
    if (prompt.length < 140) {
      return 'Add more sensory context, constraints, or references to unlock richer model outputs.';
    }
    return 'Great foundation — refine tone, add format guardrails, or queue platform-specific variations.';
  }, [prompt]);

  return (
    <section id="workspace" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white">
            Advanced Prompt Composer
          </h1>
          <p className="mt-1 text-sm text-slate-400">Visual drag & drop builder, CoT reasoning, and auto-optimization.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPrompt('')}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:text-white"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(blueprint.optimizedPrompt)}
            className="flex items-center gap-2 rounded-full bg-primary/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary"
          >
            <Copy className="h-4 w-4" /> Export Optimized
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div
          layout
          className="xl:col-span-2 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <AlignLeft className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl text-white">Prompt Draft</h2>
              <p className="text-xs text-slate-400">Smart autosave · Semantic diffing · Version snapshots</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onBlur={() => prompt && pushHistory(prompt)}
              placeholder="Describe the creative brief or objective. Include tone, audience, deliverable, and constraints."
              className="h-64 w-full resize-none rounded-xl border border-slate-700/40 bg-slate-900/40 p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-2 text-xs text-slate-400">{helperText}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-400">{prompt.length} chars</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">Blueprint score {blueprint.score}</span>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-accent">Magic enhance {blueprint.checkpoints.length} layers</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {promptTemplates.map((template) => (
              <button
                type="button"
                key={template}
                onClick={() => setPrompt(template)}
                className="bento-card h-full p-4 text-left text-sm text-slate-200"
              >
                <Wand2 className="mb-2 h-4 w-4 text-primary" />
                {template}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          layout
          className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg text-white">Architect Mode</h3>
              <p className="text-xs text-slate-400">Chain-of-thought • Bias guard • Persona alignment</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="rounded-full bg-white/10 px-2 py-1">Realtime</span>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">CoT</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            {(['composer', 'chain', 'audit'] as const).map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-3 py-2 capitalize transition ${
                  activeTab === tab
                    ? 'bg-primary/80 text-white shadow shadow-primary/40'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'composer' && (
            <div className="space-y-3 text-sm text-slate-200">
              {blueprint.error && (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-200">
                  {blueprint.error}
                </div>
              )}
              <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                <p className="font-medium text-white">Optimized Prompt</p>
                <p className="mt-1 text-xs text-slate-400">
                  {blueprint.isLoading ? 'Coordinating partner engines...' : 'Latest weave delivered.'}
                </p>
                <p className="mt-2 whitespace-pre-line text-xs text-slate-300">{blueprint.optimizedPrompt}</p>
              </div>
              {blueprint.imagePrompt && (
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
                  <p className="font-medium text-white">Visual Brief</p>
                  <p className="mt-1 text-xs text-slate-400">Nebula Sketch rendering cue.</p>
                  <p className="mt-2 text-xs text-slate-300">{blueprint.imagePrompt}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'chain' && (
            <div className="space-y-3 text-sm text-slate-200">
              {chainSteps.map((step, index) => (
                <div key={step} className="rounded-2xl border border-white/5 bg-slate-900/40 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-white">{step}</p>
                      <p className="text-xs text-slate-400">Engine guidance for this checkpoint.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="font-semibold text-amber-200">Bias & Safety Monitor</p>
                  <p>
                    {blueprint.insights.length > 0
                      ? blueprint.insights[0]
                      : 'No flagged risks. Include inclusive language checks when targeting broad audiences.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-4">
                <Layers className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-white">Optimization Layers</p>
                  <ul className="mt-2 space-y-1">
                    {blueprint.checkpoints.map((checkpoint) => (
                      <li key={checkpoint} className="flex items-center gap-2 text-slate-200">
                        <Flame className="h-4 w-4 text-accent" /> {checkpoint}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Split className="h-5 w-5 text-sky-400" />
                <div>
                  <p className="font-semibold text-white">Platform Notes</p>
                  <p>
                    Auto-adjusts syntax for Aurora Loom, Silk Verse Oracle, Prism Forge, and Nebula Sketch call flows. Run
                    cross-engine checks to confirm nuance fidelity.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <p className="font-display text-sm text-white">Engine Delegation</p>
              <span className="text-xs text-slate-400">{blueprint.isLoading ? 'Running orchestration' : 'Synced'}</span>
            </div>
            <div className="space-y-2 text-xs">
              {agentStatuses.map((agent) => (
                <div key={agent.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{agent.name}</p>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-wide ${
                        agentStatusStyles[agent.status] ?? 'bg-white/5 text-slate-300'
                      }`}
                    >
                      {agentStatusLabels[agent.status] ?? 'Idle'}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">{agent.role}</p>
                  <p className="mt-2 text-xs text-slate-300">{agent.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PromptWorkspace;

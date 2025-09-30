import { motion } from 'framer-motion';
import { Activity, AlertTriangle, SignalHigh } from 'lucide-react';

import { PLATFORM_CONFIG } from '../data/platforms';
import usePromptStore from '../state/usePromptStore';

const statusStyles: Record<string, string> = {
  operational: 'bg-emerald-500/10 text-emerald-400',
  degraded: 'bg-amber-500/10 text-amber-300',
  outage: 'bg-rose-500/10 text-rose-300',
};

const PlatformMatrix = () => {
  const { activePlatform, setPlatform } = usePromptStore();

  return (
    <section id="platforms" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-white">Multi-Platform Orchestrator</h2>
          <p className="text-sm text-slate-400">Monitor status, adjust parameters, and prep prompts for 15+ AI providers.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <SignalHigh className="h-4 w-4 text-primary" />
          <span>Latency synced every 30s</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {PLATFORM_CONFIG.map((platform) => (
          <motion.button
            layout
            type="button"
            key={platform.id}
            onClick={() => setPlatform(platform.id)}
            className={`bento-card w-full p-6 text-left transition ${
              activePlatform === platform.id ? 'ring-2 ring-primary/60' : 'hover:ring-2 hover:ring-primary/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{platform.category}</p>
                <h3 className="mt-2 font-display text-xl text-white">{platform.name}</h3>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs ${statusStyles[platform.status]}`}>
                {platform.status === 'operational' ? 'Operational' : platform.status === 'degraded' ? 'Degraded' : 'Outage'}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
              <span className="rounded-full bg-white/5 px-3 py-1">{platform.recommendedLength}</span>
              <span className="rounded-full bg-white/5 px-3 py-1">Latency {platform.latencyMs}ms</span>
              {platform.supportsNegativePrompt && <span className="rounded-full bg-white/5 px-3 py-1">Negative prompt</span>}
            </div>

            <div className="mt-4 space-y-2">
              {platform.parameters.map((parameter) => (
                <div
                  key={parameter.key}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300"
                >
                  <span>{parameter.label}</span>
                  <span>
                    {parameter.type === 'slider'
                      ? `${parameter.min} – ${parameter.max}`
                      : parameter.type === 'text'
                      ? 'Custom'
                      : 'Options'}
                  </span>
                </div>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bento-card p-6">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-display text-xl text-white">Open Router Signal</h3>
              <p className="text-xs text-slate-400">Smart model switching and rate limit harmonization.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 text-xs text-slate-300">
            <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
              <span>GPT-4o mini (fast)</span>
              <span className="text-emerald-400">32% load</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
              <span>Claude 3.5 Sonnet</span>
              <span className="text-amber-300">62% load</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
              <span>Gemini 1.5 Flash</span>
              <span className="text-rose-300">Rate limited</span>
            </div>
          </div>
        </div>

        <div className="bento-card p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <div>
              <h3 className="font-display text-xl text-white">Safety & Bias Monitor</h3>
              <p className="text-xs text-slate-400">Automated auditing across platforms and modalities.</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-xs text-slate-300">
            <li className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
              Emotional intensity flagged for Midjourney — consider moderation guidelines.
            </li>
            <li className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3">
              Check for inclusive language in demographic descriptors.
            </li>
            <li className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3">
              Suggest adding success metric for marketing prompts (e.g., CTR uplift target).
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PlatformMatrix;

import { AnimatePresence, motion } from 'framer-motion';
import { Palette, Sparkles, Spline, Theater, Zap } from 'lucide-react';
import { useState } from 'react';

import usePromptStore from '../state/usePromptStore';
import { MOOD_TONES, PERSONA_LIBRARY, STORY_ARCS, STYLE_MOVEMENTS } from '../data/styles';

const tonePalettes: Record<string, string[]> = {
  Celestial: ['#6366f1', '#c084fc', '#0ea5e9'],
  Whimsical: ['#f59e0b', '#f97316', '#facc15'],
  Gritty: ['#1f2937', '#4b5563', '#9ca3af'],
  Introspective: ['#334155', '#64748b', '#94a3b8'],
  Optimistic: ['#22c55e', '#86efac', '#bef264'],
  Melancholic: ['#475569', '#94a3b8', '#cbd5f5'],
  Electric: ['#0ea5e9', '#14b8a6', '#f43f5e'],
  Mystic: ['#7c3aed', '#8b5cf6', '#c084fc'],
  Playful: ['#ec4899', '#f97316', '#22d3ee'],
  Regal: ['#7c3aed', '#facc15', '#f8fafc'],
};

const CreativeEnhancerPanel = () => {
  const { tone, setTone, persona, setPersona, styleFusion, setStyleFusion } = usePromptStore();
  const [activeArc, setActiveArc] = useState(STORY_ARCS[0]);
  const [activeMood, setActiveMood] = useState(MOOD_TONES[0]);

  const toggleStyle = (style: string) => {
    if (styleFusion.includes(style)) {
      setStyleFusion(styleFusion.filter((s) => s !== style));
    } else if (styleFusion.length < 4) {
      setStyleFusion([...styleFusion, style]);
    }
  };

  return (
    <section id="enhancers" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-white">Creative Enhancement Suite</h2>
          <p className="text-sm text-slate-400">Blend personas, tones, and art movements to sculpt unique prompts.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">Style mixer</span>
          <span className="rounded-full bg-white/10 px-3 py-1">Mood engine</span>
        </div>
      </div>

      <div className="bento-grid">
        <motion.div layout className="bento-card col-span-2 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl text-white">Persona Builder</h3>
              <p className="text-xs text-slate-400">Define the creative strategist guiding prompt generation.</p>
            </div>
            <Theater className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {PERSONA_LIBRARY.map((personaItem) => {
              const isActive = persona === personaItem.name;
              return (
                <button
                  type="button"
                  key={personaItem.id}
                  onClick={() => setPersona(personaItem.name)}
                  className={`group rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? 'border-primary/60 bg-primary/10 text-white shadow shadow-primary/30'
                      : 'border-white/10 bg-white/5 text-slate-200 hover:border-primary/40'
                  }`}
                >
                  <p className="font-semibold">{personaItem.name}</p>
                  <p className="mt-1 text-xs text-slate-400 group-hover:text-slate-200">
                    {personaItem.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
                    {personaItem.strengths.map((strength) => (
                      <span key={strength} className="rounded-full bg-white/10 px-2 py-1 text-slate-300">
                        {strength}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div layout className="bento-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl text-white">Tone & Mood</h3>
              <p className="text-xs text-slate-400">Adaptive energy generator with palette previews.</p>
            </div>
            <Palette className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {MOOD_TONES.map((mood) => (
              <button
                type="button"
                key={mood}
                onClick={() => {
                  setTone(mood.toLowerCase());
                  setActiveMood(mood);
                }}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  activeMood === mood ? 'bg-primary/90 text-white shadow shadow-primary/40' : 'bg-white/10 text-slate-300'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            {tonePalettes[activeMood].map((color) => (
              <motion.div
                key={color}
                layoutId={color}
                className="h-10 w-10 rounded-2xl"
                style={{ background: color }}
                whileHover={{ scale: 1.1 }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div layout className="bento-card col-span-2 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl text-white">Style Fusion Matrix</h3>
              <p className="text-xs text-slate-400">Blend up to four movements to guide visual prompts.</p>
            </div>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {STYLE_MOVEMENTS.map((movement) => {
              const isSelected = styleFusion.includes(movement);
              return (
                <button
                  type="button"
                  key={movement}
                  onClick={() => toggleStyle(movement)}
                  className={`rounded-2xl border px-4 py-3 text-left text-xs transition ${
                    isSelected
                      ? 'border-primary/60 bg-primary/10 text-white shadow shadow-primary/30'
                      : 'border-white/10 bg-white/5 text-slate-200 hover:border-primary/30'
                  }`}
                >
                  {movement}
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div layout className="bento-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl text-white">Narrative Arc Generator</h3>
              <p className="text-xs text-slate-400">Structure prompts for storytelling outputs.</p>
            </div>
            <Spline className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-4 space-y-3">
            {STORY_ARCS.map((arc) => (
              <button
                type="button"
                key={arc.id}
                onClick={() => setActiveArc(arc)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-xs transition ${
                  activeArc.id === arc.id
                    ? 'border-primary/60 bg-primary/10 text-white shadow shadow-primary/20'
                    : 'border-white/10 bg-white/5 text-slate-200 hover:border-primary/30'
                }`}
              >
                <p className="font-semibold">{arc.name}</p>
                <p className="mt-2 text-[11px] text-slate-300">{arc.phases.join(' → ')}</p>
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          <motion.div
            key={activeArc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bento-card col-span-3 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl text-white">Arc Blueprint</h3>
                <p className="text-xs text-slate-400">Auto-populated prompt scaffolding.</p>
              </div>
              <Zap className="h-5 w-5 text-accent" />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {activeArc.phases.map((phase) => (
                <div key={phase} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Phase</p>
                  <p className="mt-2 font-semibold text-white">{phase}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    Anchor prompt instructions with the objective, sensory palette, and evaluation criteria for this moment.
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CreativeEnhancerPanel;

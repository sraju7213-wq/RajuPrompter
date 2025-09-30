import { BookmarkPlus, Filter, FolderKanban, Link2, Star } from 'lucide-react';
import { useMemo } from 'react';

import { nanoid } from 'nanoid/non-secure';
import { motion } from 'framer-motion';
import { PLATFORM_CONFIG } from '../data/platforms';
import usePromptStore, { PromptDraft } from '../state/usePromptStore';

const categories = ['Art', 'Writing', 'Marketing', 'Technical'];

const featuredPrompts: PromptDraft[] = [
  {
    id: nanoid(),
    title: 'Aurora Loom Narrative Blueprint',
    prompt:
      'System: Invoke Aurora Loom to craft a multi-stage product launch brief. Stage 1: frame the ambition and audience. Stage 2: list tonal cues and sensory anchors. Stage 3: deliver numbered directives with success metrics and guardrails.',
    model: 'aurora-loom',
    tags: ['strategy', 'launch', 'structured'],
    lastUpdated: new Date().toISOString(),
    rating: 4.9,
  },
  {
    id: nanoid(),
    title: 'Nebula Sketch Panorama Cue',
    prompt:
      'Compose a single-shot visual brief for Nebula Sketch Foundry. Highlight camera lens, lighting mood, and texture layers blending Solarpunk with Techno Mysticism. Include one line of negative cues to avoid clutter.',
    model: 'nebula-foundry',
    tags: ['visual', 'solarpunk', 'mood'],
    lastUpdated: new Date().toISOString(),
    rating: 4.8,
  },
];

const PromptLibrary = () => {
  const { drafts, addDraft } = usePromptStore();
  const platformNames = useMemo(
    () =>
      Object.fromEntries(
        PLATFORM_CONFIG.map((platform) => [platform.id, platform.name]),
      ) as Record<string, string>,
    [],
  );

  return (
    <section id="library" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-white">Smart Prompt Library</h2>
          <p className="text-sm text-slate-400">Searchable vault with semantic tagging, ratings, and version history.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="h-4 w-4" />
          <span>Semantic filters active</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {categories.map((category) => (
          <div key={category} className="bento-card p-4 text-sm text-slate-200">
            <FolderKanban className="mb-2 h-5 w-5 text-primary" />
            <p className="font-semibold text-white">{category}</p>
            <p className="mt-1 text-xs text-slate-400">Curated prompts + engine suggested variations.</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[...featuredPrompts, ...drafts.slice(0, 2)].map((prompt) => (
          <motion.div key={prompt.id} layout className="bento-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {platformNames[prompt.model] ?? prompt.model}
                </p>
                <h3 className="mt-2 font-display text-xl text-white">{prompt.title}</h3>
              </div>
              <div className="flex items-center gap-1 text-amber-300">
                <Star className="h-4 w-4" />
                <span className="text-sm font-semibold">{prompt.rating ?? '4.7'}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-300 line-clamp-4">{prompt.prompt}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wide text-slate-400">
              {prompt.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <button
                type="button"
                onClick={() =>
                  addDraft({
                    ...prompt,
                    id: nanoid(),
                    lastUpdated: new Date().toISOString(),
                    title: `${prompt.title} (copy)`,
                  })
                }
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
              >
                Duplicate
              </button>
              <button type="button" className="inline-flex items-center gap-1 text-primary">
                <Link2 className="h-4 w-4" /> Share
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bento-card p-6">
        <div className="flex items-center gap-3">
          <BookmarkPlus className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-display text-xl text-white">Prompt Vault</h3>
            <p className="text-xs text-slate-400">End-to-end encrypted personal repository with semantic search.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 text-xs text-slate-300 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-sm font-semibold text-white">Encrypted Vault</p>
            <p className="mt-1 text-slate-400">AES-256 at rest, rotating keys via secure enclave.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-sm font-semibold text-white">Community Exchange</p>
            <p className="mt-1 text-slate-400">Share prompts, gather ratings, remix iterations.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-sm font-semibold text-white">Versioning</p>
            <p className="mt-1 text-slate-400">Diff prompts, track experiments, restore snapshots.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromptLibrary;

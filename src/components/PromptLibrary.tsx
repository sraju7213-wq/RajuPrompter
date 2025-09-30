import { BookmarkPlus, Filter, FolderKanban, Link2, Star } from 'lucide-react';

import usePromptStore, { PromptDraft } from '../state/usePromptStore';
import { nanoid } from 'nanoid/non-secure';
import { motion } from 'framer-motion';

const categories = ['Art', 'Writing', 'Marketing', 'Technical'];

const featuredPrompts: PromptDraft[] = [
  {
    id: nanoid(),
    title: 'Flux Hybrid Visual Storyboard',
    prompt:
      'System: Orchestrate a Flux Pro cinematic storyboard. Step 1: establish subject silhouette and lighting anchors. Step 2: iterate 4 camera angles blending Solarpunk + Techno Mysticism. Step 3: deliver final prompt with lens, texture, and mood directives.',
    model: 'flux',
    tags: ['visual', 'solarpunk', 'cinematic'],
    lastUpdated: new Date().toISOString(),
    rating: 4.9,
  },
  {
    id: nanoid(),
    title: 'GPT-4o Thought Leadership Article',
    prompt:
      'Write a 1200-word industry brief on regenerative design. Include trend analysis, expert quotes, and a 3-step action framework. Close with optimistic call-to-action tied to measurable KPIs.',
    model: 'openai',
    tags: ['writing', 'strategy'],
    lastUpdated: new Date().toISOString(),
    rating: 4.8,
  },
];

const PromptLibrary = () => {
  const { drafts, addDraft } = usePromptStore();

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
            <p className="mt-1 text-xs text-slate-400">Curated prompts + AI suggested variations.</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[...featuredPrompts, ...drafts.slice(0, 2)].map((prompt) => (
          <motion.div key={prompt.id} layout className="bento-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{prompt.model}</p>
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

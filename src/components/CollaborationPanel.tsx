import { motion } from 'framer-motion';
import { Globe2, MessageSquarePlus, Users } from 'lucide-react';

import usePromptStore from '../state/usePromptStore';

const presenceGradient = ['from-primary/60 to-emerald-500/60', 'from-accent/60 to-primary/60'];

const CollaborationPanel = () => {
  const { collaborators } = usePromptStore();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-white">Realtime Collaboration</h2>
          <p className="text-sm text-slate-400">Live cursors, chat threads, and role-based workspaces.</p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-primary/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary">
          <MessageSquarePlus className="h-4 w-4" />
          Invite teammate
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <motion.div layout className="bento-card p-6">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-white">Team Presence</p>
              <p className="text-xs text-slate-400">{collaborators.length} active collaborators</p>
            </div>
          </div>
          <div className="mt-4 space-y-3 text-xs text-slate-300">
            {collaborators.length === 0 && <p>No collaborators connected. Share invite link to collaborate.</p>}
            {collaborators.slice(0, 4).map((collaborator, index) => (
              <div
                key={collaborator.id}
                className={`flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r ${presenceGradient[index % presenceGradient.length]} px-4 py-3 text-white`}
              >
                <div>
                  <p className="font-semibold">{collaborator.name}</p>
                  <p className="text-[11px] uppercase tracking-wide">{collaborator.role}</p>
                </div>
                <span className="text-[11px] text-white/80">
                  {collaborator.isActive ? 'Active now' : 'Idle'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div layout className="bento-card p-6">
          <div className="flex items-center gap-3">
            <Globe2 className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-white">Shared Canvas</p>
              <p className="text-xs text-slate-400">Live cursor tracking & structured comment threads.</p>
            </div>
          </div>
          <div className="mt-4 space-y-3 text-xs text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-sm font-semibold text-white">Prompt Workshop</p>
              <p className="mt-1 text-slate-400">Split-screen editing, layered annotation markers, and version stamps.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-sm font-semibold text-white">Comment Streams</p>
              <p className="mt-1 text-slate-400">Threaded insights with emoji reactions and action assignments.</p>
            </div>
          </div>
        </motion.div>

        <motion.div layout className="bento-card p-6">
          <p className="text-sm text-slate-300">
            Configure roles (strategist, writer, art director, engineer) with granular access. Integrate with Slack, Notion, or
            custom webhooks for automated publishing flows.
          </p>
          <div className="mt-4 grid gap-2 text-xs text-slate-400">
            <span className="rounded-full bg-white/5 px-3 py-2">Role-based permissions</span>
            <span className="rounded-full bg-white/5 px-3 py-2">Audit log trail</span>
            <span className="rounded-full bg-white/5 px-3 py-2">Session recording</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CollaborationPanel;

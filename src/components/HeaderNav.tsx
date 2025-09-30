import { motion } from 'framer-motion';
import { BrainCircuit, Menu, Mic, Search, Sparkles, SunMoon, UsersRound } from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Workspace', href: '#workspace' },
  { name: 'Enhancers', href: '#enhancers' },
  { name: 'Platforms', href: '#platforms' },
  { name: 'Library', href: '#library' },
  { name: 'Analytics', href: '#analytics' },
];

const userModes = ['Explorer', 'Producer', 'Agency'];

const HeaderNav = () => {
  const [activeMode, setActiveMode] = useState(userModes[0]);
  const [search, setSearch] = useState('');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-surface/80 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6">
        <motion.a
          whileHover={{ scale: 1.04 }}
          href="/"
          className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2"
        >
          <div className="gradient-border">
            <div className="rounded-[22px] bg-surface px-3 py-2">
              <BrainCircuit className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">NovaForge</p>
            <p className="text-xs text-slate-400">Prompt Architect 2025</p>
          </div>
        </motion.a>

        <nav className="hidden flex-1 items-center justify-center gap-6 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-slate-300 lg:flex">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className="transition hover:text-white">
              {item.name}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search prompts, workflows, personas"
              className="w-64 rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:border-primary/40 hover:text-white"
          >
            <SunMoon className="mr-2 inline h-4 w-4" /> Adaptive
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-primary/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary"
          >
            <UsersRound className="h-4 w-4" />
            Live
          </button>
        </div>

        <button className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden">
          <Menu className="h-5 w-5" />
        </button>

        <button className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-white xl:flex">
          <Mic className="mr-2 h-4 w-4" /> Voice
        </button>
        <button className="hidden rounded-full bg-accent/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition hover:bg-accent xl:flex">
          <Sparkles className="mr-2 h-4 w-4" /> Magic Enhance
        </button>
      </div>

      <div className="mx-auto mt-3 flex max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-medium text-emerald-400">Realtime</span>
          <span>15 providers · Auto rate limiting · Bias monitor active</span>
        </div>
        <div className="flex items-center gap-2">
          {userModes.map((mode) => (
            <button
              type="button"
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={`rounded-full px-3 py-1 text-xs transition ${
                activeMode === mode
                  ? 'bg-white/20 text-white shadow shadow-white/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default HeaderNav;

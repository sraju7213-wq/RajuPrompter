import { useEffect } from 'react';

import AnalyticsPanel from './components/AnalyticsPanel';
import CollaborationPanel from './components/CollaborationPanel';
import CreativeEnhancerPanel from './components/CreativeEnhancerPanel';
import HeaderNav from './components/HeaderNav';
import PlatformMatrix from './components/PlatformMatrix';
import PromptLibrary from './components/PromptLibrary';
import PromptWorkspace from './components/PromptWorkspace';
import usePromptStore from './state/usePromptStore';

const App = () => {
  const toggleMagicEnhance = usePromptStore((state) => state.toggleMagicEnhance);

  useEffect(() => {
    const timer = setInterval(() => {
      toggleMagicEnhance();
    }, 120000);

    return () => clearInterval(timer);
  }, [toggleMagicEnhance]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_40%),linear-gradient(180deg,_#020617,_#0f172a)] text-slate-100">
      <HeaderNav />
      <main className="mx-auto max-w-7xl space-y-16 px-6 pb-24 pt-10">
        <PromptWorkspace />
        <CreativeEnhancerPanel />
        <PlatformMatrix />
        <PromptLibrary />
        <CollaborationPanel />
        <AnalyticsPanel />
      </main>
      <footer className="border-t border-white/5 bg-slate-950/80 py-10 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} NovaForge Labs · Secure · GDPR compliant · API ready
      </footer>
    </div>
  );
};

export default App;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PlatformId = 'aurora-loom' | 'silk-oracle' | 'prism-forge' | 'nebula-foundry';

export interface PromptDraft {
  id: string;
  title: string;
  prompt: string;
  model: PlatformId;
  tags: string[];
  lastUpdated: string;
  rating?: number;
}

export interface CollaborationPresence {
  id: string;
  name: string;
  role: 'designer' | 'writer' | 'strategist' | 'engineer';
  color: string;
  cursor: { x: number; y: number } | null;
  isActive: boolean;
}

interface PromptStoreState {
  prompt: string;
  persona: string;
  tone: string;
  styleFusion: string[];
  activePlatform: PlatformId;
  isMagicEnhanceOn: boolean;
  drafts: PromptDraft[];
  history: string[];
  collaborators: CollaborationPresence[];
  setPrompt: (prompt: string) => void;
  setPersona: (persona: string) => void;
  setTone: (tone: string) => void;
  toggleMagicEnhance: () => void;
  setStyleFusion: (styles: string[]) => void;
  setPlatform: (platform: PlatformId) => void;
  addDraft: (draft: PromptDraft) => void;
  updateDraft: (id: string, patch: Partial<PromptDraft>) => void;
  pushHistory: (prompt: string) => void;
  addCollaborator: (presence: CollaborationPresence) => void;
  updateCollaborator: (id: string, patch: Partial<CollaborationPresence>) => void;
}

const usePromptStore = create<PromptStoreState>()(
  persist(
    (set) => ({
      prompt: '',
      persona: '',
      tone: 'balanced',
      styleFusion: [],
      activePlatform: 'aurora-loom',
      isMagicEnhanceOn: true,
      drafts: [],
      history: [],
      collaborators: [],
      setPrompt: (prompt) => set({ prompt }),
      setPersona: (persona) => set({ persona }),
      setTone: (tone) => set({ tone }),
      setStyleFusion: (styleFusion) => set({ styleFusion }),
      toggleMagicEnhance: () => set((state) => ({ isMagicEnhanceOn: !state.isMagicEnhanceOn })),
      setPlatform: (activePlatform) => set({ activePlatform }),
      addDraft: (draft) => set((state) => ({ drafts: [draft, ...state.drafts].slice(0, 60) })),
      updateDraft: (id, patch) =>
        set((state) => ({
          drafts: state.drafts.map((draft) => (draft.id === id ? { ...draft, ...patch } : draft)),
        })),
      pushHistory: (prompt) =>
        set((state) => ({
          history: [prompt, ...state.history].slice(0, 50),
        })),
      addCollaborator: (presence) =>
        set((state) => ({
          collaborators: [...state.collaborators.filter((c) => c.id !== presence.id), presence],
        })),
      updateCollaborator: (id, patch) =>
        set((state) => ({
          collaborators: state.collaborators.map((collaborator) =>
            collaborator.id === id ? { ...collaborator, ...patch } : collaborator,
          ),
        })),
    }),
    { name: 'prompt-studio' },
  ),
);

export default usePromptStore;

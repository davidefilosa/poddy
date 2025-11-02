import { create } from "zustand";

interface AudioState {
  audioUrl: string | undefined;
  setAudioUrl: (url: string) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  audioUrl: undefined,
  setAudioUrl: (url: string) => set(() => ({ audioUrl: url })),
}));

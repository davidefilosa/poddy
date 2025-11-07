import { create } from "zustand";

interface LayoutState {
  layout: "grid" | "list";
  setLayout: (layout: "grid" | "list") => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  layout: "grid",
  setLayout: (layout) => set(() => ({ layout })),
}));

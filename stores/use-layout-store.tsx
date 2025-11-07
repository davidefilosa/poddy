import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LayoutState {
  layout: "grid" | "list";
  setLayout: (layout: "grid" | "list") => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      layout: "grid",
      setLayout: (layout) => set(() => ({ layout })),
    }),
    {
      name: "layout-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

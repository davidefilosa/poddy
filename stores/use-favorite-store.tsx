import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FavoriteState {
  favorite: boolean;
  toggleFavorite: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set) => ({
      favorite: false,
      toggleFavorite: () => set((state) => ({ favorite: !state.favorite })),
    }),
    {
      name: "favorite-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

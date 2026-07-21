import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CalorieResult } from "@/types";

interface MealState {
  lastResult: CalorieResult | null;
  history: CalorieResult[];
  setResult: (result: CalorieResult) => void;
  clearHistory: () => void;
}

export const useMealStore = create<MealState>()(
  persist(
    (set) => ({
      lastResult: null,
      history: [],
      setResult: (result) =>
        set((state) => {
          const resultWithTimestamp = {
            ...result,
            timestamp: new Date().toISOString(),
          };
          return {
            lastResult: resultWithTimestamp,
            history: [resultWithTimestamp, ...state.history],
          };
        }),
      clearHistory: () => set({ lastResult: null, history: [] }),
    }),
    {
      name: "meal-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

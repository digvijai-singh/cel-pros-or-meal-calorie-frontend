import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CalorieResult } from "@/types";

interface MealState {
  lastResult: CalorieResult | null;
  tempResult: CalorieResult | null;
  history: CalorieResult[];
  setResult: (result: CalorieResult) => void;
  setTempResult: (result: CalorieResult | null) => void;
  logMeal: (meal: CalorieResult) => void;
  clearHistory: () => void;
}

export const useMealStore = create<MealState>()(
  persist(
    (set) => ({
      lastResult: null,
      tempResult: null,
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
      setTempResult: (result) => set({ tempResult: result }),
      logMeal: (meal) =>
        set((state) => {
          const mealWithTimestamp = {
            ...meal,
            timestamp: meal.timestamp || new Date().toISOString(),
          };
          return {
            lastResult: mealWithTimestamp,
            history: [mealWithTimestamp, ...state.history],
            tempResult: null,
          };
        }),
      clearHistory: () => set({ lastResult: null, tempResult: null, history: [] }),
    }),
    {
      name: "meal-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

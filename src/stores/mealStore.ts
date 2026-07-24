import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CalorieResult, Macronutrients } from "@/types";

export interface MealBuilderItem {
  id: string;
  dish_name: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  macronutrients_per_serving: Macronutrients;
  total_macronutrients: Macronutrients;
  ingredient_breakdown: any[];
  matched_food: any;
  image?: string;
  description?: string;
}

interface MealState {
  lastResult: CalorieResult | null;
  tempResult: CalorieResult | null;
  history: CalorieResult[];
  currentMeal: MealBuilderItem[];
  setResult: (result: CalorieResult) => void;
  setTempResult: (result: CalorieResult | null) => void;
  logMeal: (meal: CalorieResult) => void;
  clearHistory: () => void;
  addToMeal: (item: CalorieResult) => void;
  removeFromMeal: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearMeal: () => void;
  logCurrentMeal: (timeString: string, category: string) => void;
  waterIntake: number;
  addWater: () => void;
  resetWater: () => void;
}

const getFoodImage = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes("mac") || n.includes("cheese") || n.includes("pasta")) {
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuDcphLX1C8zZHMHEVhD7DRrgKlFnoq2ktpjYWU4h0fvgIfHnjYVQviJfmQQesX6EWt4NbRkR-CS7xVDgFFIuIhxPaUXKI-ktBOvBT7rd5Id6ssPawIfKkTzBhlkflCf2ohzwead8eEGhJPTCpN3SP_z8OlrgoiR4Jh1jMqG7UYc2kyxnV4PN9z-4-fOCZL11PoQcU9n6_FvHesGTtqULPN5ToS5pW-UPh9nBUJLh0YEFIUD46AxI_ADQoBFKZ0KdTJ2iUhQDPO8upc";
  }
  if (n.includes("burger") || n.includes("slider")) {
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuCuRtVs8TJf0sBkZwYaDqSRwRr-int5xEWnTLvt6hH1RCGPW3cq_jVeEvPaFUIjR96VrWtEuulOmQBzVDjB--6CX4LBNqWJpzi8i5AcRQS1tGLisG10WITwyileU7BlTj2RmXzeNnL6rO8EcxSXjwA0f9FIrjU9c55ksgl4YP7yuuin-H-kt_kiMtvSMT7LtIoQ95p6xUVktfVSTy3jhiPsQoPG_6gvnrOkDs8iETzitp9XcdwsfqVBnXJPFNpQYhT9Vj_N9iweaT8";
  }
  if (n.includes("sandwich")) {
    return "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=200";
  }
  if (n.includes("toast") || n.includes("bread") || n.includes("bagel") || n.includes("croissant")) {
    return "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200";
  }
  if (n.includes("fry") || n.includes("fries") || n.includes("potato") || n.includes("chips")) {
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuCrjdVYvVeITD7uhj9GsV2XRk7OXK2l2_Auq7iddB6mUU9nqG_9jXidZIA0Cn-wWxtS3ZYj9DNCPsgyvOBbdxUtKdMbBQwJA9jdb_GadXbhY2Z9dKwqMI6cXbI4OKxs8FhXIwW8OsFZpb9-eZCNzzW6bt8xXhg6tcL9ejYXPv4RAHEfyD8fMSrn0X2lnow24zkJsC_Bm74b7LnjPFUmzLXhoMCi2t-hht5V41vIdNkNmuDyFg2d-2Hw7m1k4rw79DZbWmifeMESC8s";
  }
  if (n.includes("coke") || n.includes("cola") || n.includes("soda") || n.includes("drink") || n.includes("beverage") || n.includes("water") || n.includes("juice")) {
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuA0-B3kRk4bokx4GQFdkKaQRNXfGZYkMHeel2pM1mzHsEcRkhu5VOFIX_ag9btmRMghkmVg7xdjLAbBYzzzk3dIaMHHXtqhQDEU1tqIGqKn3mzDXxsJgOGp7zpPBfGw5RVxy4INoYGZTeilciJA1kxshGMEIP7UbTMJr4hgy2X7Xl2wqDSgYfx9JXA2nhdQCIzP6tRskbMBB7XCT1BZDX2BV6DKH5LieyHdY9w5D__q1FGefucWfn7ugnBOYEmY1WAbPixF6-vhmEs";
  }
  return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=200";
};

export const useMealStore = create<MealState>()(
  persist(
    (set) => ({
      lastResult: null,
      tempResult: null,
      history: [],
      currentMeal: [],
      
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

      addToMeal: (item) =>
        set((state) => {
          const newItem: MealBuilderItem = {
            id: `${item.dish_name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            dish_name: item.dish_name,
            servings: item.servings || 1.0,
            calories_per_serving: item.calories_per_serving,
            total_calories: item.total_calories,
            macronutrients_per_serving: { ...item.macronutrients_per_serving },
            total_macronutrients: { ...item.total_macronutrients },
            ingredient_breakdown: item.ingredient_breakdown || [],
            matched_food: item.matched_food || {},
            image: getFoodImage(item.dish_name),
            description: item.matched_food?.data_type ? `USDA • ${item.matched_food.data_type}` : "Standard Reference"
          };
          return {
            currentMeal: [...state.currentMeal, newItem]
          };
        }),

      removeFromMeal: (id) =>
        set((state) => ({
          currentMeal: state.currentMeal.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          currentMeal: state.currentMeal.map((item) => {
            if (item.id !== id) return item;
            
            const servings = Math.max(0.25, quantity);
            return {
              ...item,
              servings,
              total_calories: item.calories_per_serving * servings,
              total_macronutrients: {
                protein: item.macronutrients_per_serving.protein * servings,
                carbohydrates: item.macronutrients_per_serving.carbohydrates * servings,
                total_fat: item.macronutrients_per_serving.total_fat * servings,
                fiber: (item.macronutrients_per_serving.fiber || 0) * servings,
                sugars: (item.macronutrients_per_serving.sugars || 0) * servings,
                saturated_fat: (item.macronutrients_per_serving.saturated_fat || 0) * servings,
              }
            };
          }),
        })),

      clearMeal: () => set({ currentMeal: [] }),

      waterIntake: 0,
      addWater: () => set((state) => ({ waterIntake: (state.waterIntake || 0) + 1 })),
      resetWater: () => set({ waterIntake: 0 }),

      logCurrentMeal: (timeString, category) =>
        set((state) => {
          if (state.currentMeal.length === 0) return {};

          const totalCalories = state.currentMeal.reduce((sum, item) => sum + item.total_calories, 0);
          const totalProtein = state.currentMeal.reduce((sum, item) => sum + item.total_macronutrients.protein, 0);
          const totalCarbs = state.currentMeal.reduce((sum, item) => sum + item.total_macronutrients.carbohydrates, 0);
          const totalFat = state.currentMeal.reduce((sum, item) => sum + item.total_macronutrients.total_fat, 0);
          const totalFiber = state.currentMeal.reduce((sum, item) => sum + (item.total_macronutrients.fiber || 0), 0);
          const totalSugars = state.currentMeal.reduce((sum, item) => sum + (item.total_macronutrients.sugars || 0), 0);
          const totalSatFat = state.currentMeal.reduce((sum, item) => sum + (item.total_macronutrients.saturated_fat || 0), 0);

          const compiledName = state.currentMeal.map(item => item.dish_name).join(", ");

          const compiledResult: CalorieResult = {
            dish_name: compiledName,
            servings: 1.0,
            data_source: "USDA FoodData Central (Compiled Meal)",
            calories_per_serving: totalCalories,
            total_calories: totalCalories,
            macronutrients_per_serving: {
              protein: totalProtein,
              carbohydrates: totalCarbs,
              total_fat: totalFat,
              fiber: totalFiber,
              sugars: totalSugars,
              saturated_fat: totalSatFat,
            },
            total_macronutrients: {
              protein: totalProtein,
              carbohydrates: totalCarbs,
              total_fat: totalFat,
              fiber: totalFiber,
              sugars: totalSugars,
              saturated_fat: totalSatFat,
            },
            ingredient_breakdown: state.currentMeal.flatMap(item => item.ingredient_breakdown),
            matched_food: {
              name: compiledName,
              fdc_id: 0,
              data_type: "Compiled Meal",
              published_date: new Date().toLocaleDateString(),
            },
            category,
            timestamp: (() => {
              const d = new Date();
              if (timeString) {
                const [h, m] = timeString.split(":").map(Number);
                d.setHours(h, m, 0, 0);
              }
              return d.toISOString();
            })()
          };

          return {
            lastResult: compiledResult,
            history: [compiledResult, ...state.history],
            currentMeal: []
          };
        }),
    }),
    {
      name: "meal-storage",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const authData = localStorage.getItem("auth-storage");
          let email = "anonymous";
          if (authData) {
            try {
              const parsed = JSON.parse(authData);
              email = parsed?.state?.user?.email || "anonymous";
            } catch (e) {}
          }
          return localStorage.getItem(`${name}-${email}`);
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          const authData = localStorage.getItem("auth-storage");
          let email = "anonymous";
          if (authData) {
            try {
              const parsed = JSON.parse(authData);
              email = parsed?.state?.user?.email || "anonymous";
            } catch (e) {}
          }
          localStorage.setItem(`${name}-${email}`, value);
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          const authData = localStorage.getItem("auth-storage");
          let email = "anonymous";
          if (authData) {
            try {
              const parsed = JSON.parse(authData);
              email = parsed?.state?.user?.email || "anonymous";
            } catch (e) {}
          }
          localStorage.removeItem(`${name}-${email}`);
        }
      })),
    }
  )
);

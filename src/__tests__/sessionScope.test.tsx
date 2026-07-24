import { describe, test, expect, beforeEach } from "vitest";
import { useAuthStore } from "../stores/authStore";
import { useMealStore } from "../stores/mealStore";

describe("Session Scoping and User Isolation", () => {
  beforeEach(() => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    // Reset stores to default state
    useAuthStore.setState({ 
      token: null, 
      user: null, 
      hasCompletedTour: false, 
      completedTours: {} 
    });
    useMealStore.setState({ 
      lastResult: null, 
      tempResult: null, 
      history: [], 
      currentMeal: [], 
      waterIntake: 0 
    });
  });

  test("should preserve user-specific data and isolate profiles", () => {
    // 1. Log in User A
    const userA = { id: 1, first_name: "Alice", last_name: "Smith", email: "alice@test.com" };
    useAuthStore.getState().login("token-alice", userA);

    // 2. Add meal to history for User A
    const mealA = {
      dish_name: "Salad",
      calories_per_serving: 150,
      total_calories: 150,
      servings: 1.0,
      macronutrients_per_serving: { protein: 5, carbohydrates: 10, total_fat: 2 },
      total_macronutrients: { protein: 5, carbohydrates: 10, total_fat: 2 },
      ingredient_breakdown: [],
      matched_food: null,
      timestamp: new Date().toISOString()
    };
    useMealStore.getState().logMeal(mealA);

    // Verify User A has 1 Salad meal in history
    expect(useMealStore.getState().history.length).toBe(1);
    expect(useMealStore.getState().history[0].dish_name).toBe("Salad");

    // 3. User A logs out
    useAuthStore.getState().logout();

    // Verify after logout, in-memory state is empty (defaults to anonymous/empty key)
    expect(useMealStore.getState().history.length).toBe(0);

    // 4. Log in User B
    const userB = { id: 2, first_name: "Bob", last_name: "Jones", email: "bob@test.com" };
    useAuthStore.getState().login("token-bob", userB);

    // Verify User B starts with clean slate
    expect(useMealStore.getState().history.length).toBe(0);

    // Add meal to history for User B
    const mealB = {
      dish_name: "Burger",
      calories_per_serving: 600,
      total_calories: 600,
      servings: 1.0,
      macronutrients_per_serving: { protein: 30, carbohydrates: 50, total_fat: 25 },
      total_macronutrients: { protein: 30, carbohydrates: 50, total_fat: 25 },
      ingredient_breakdown: [],
      matched_food: null,
      timestamp: new Date().toISOString()
    };
    useMealStore.getState().logMeal(mealB);

    // Verify User B has 1 Burger meal in history
    expect(useMealStore.getState().history.length).toBe(1);
    expect(useMealStore.getState().history[0].dish_name).toBe("Burger");

    // 5. User B logs out
    useAuthStore.getState().logout();
    expect(useMealStore.getState().history.length).toBe(0);

    // 6. Log in User A again
    useAuthStore.getState().login("token-alice", userA);

    // Verify User A's Salad meal history is successfully restored!
    expect(useMealStore.getState().history.length).toBe(1);
    expect(useMealStore.getState().history[0].dish_name).toBe("Salad");
  });
});

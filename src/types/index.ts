export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface AuthResponse {
  message?: string;
  user: User;
  token: string;
}

export interface ErrorResponse {
  error: string;
  message: string | string[];
  status_code: number;
}

export interface Macronutrients {
  protein: number;
  total_fat: number;
  carbohydrates: number;
  fiber?: number;
  sugars?: number;
  saturated_fat?: number;
}

export interface IngredientBreakdownItem {
  name: string;
  calories_per_100g: number;
  macronutrients_per_100g: Macronutrients;
  serving_size: number;
  data_type: string;
  fdc_id: number;
}

export interface MatchedFood {
  name: string;
  fdc_id: number;
  data_type: string;
  published_date: string;
}

export interface CalorieResult {
  dish_name: string;
  servings: number;
  data_source: string;
  calories_per_serving: number;
  total_calories: number;
  macronutrients_per_serving: Macronutrients;
  total_macronutrients: Macronutrients;
  ingredient_breakdown: IngredientBreakdownItem[];
  matched_food: MatchedFood;
  timestamp?: string; // Add clientside timestamp for history
  category?: string; // Add clientside category (Breakfast, Lunch, Dinner, Snack)
}

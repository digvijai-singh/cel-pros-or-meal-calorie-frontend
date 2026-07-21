import { z } from "zod";

export const RegisterSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const LoginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const MealFormSchema = z.object({
  dish_name: z.string().trim().min(1, "Dish name is required"),
  servings: z.coerce
    .number()
    .positive("Servings must be a positive number"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type MealFormInput = z.infer<typeof MealFormSchema>;

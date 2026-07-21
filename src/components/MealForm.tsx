"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMealStore } from "@/stores/mealStore";
import { getCalories, ApiError } from "@/lib/api";
import { MealFormSchema, MealFormInput } from "@/lib/validations";
import { Loader2, AlertTriangle, Search } from "lucide-react";

export function MealForm() {
  const setResult = useMealStore((state) => state.setResult);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<MealFormInput>({
    resolver: zodResolver(MealFormSchema) as any,
    defaultValues: {
      dish_name: "",
      servings: 1,
    },
  });

  useEffect(() => {
    if (retryCountdown === null) return;
    if (retryCountdown <= 0) {
      setRetryCountdown(null);
      setApiError(null);
      return;
    }

    const interval = setInterval(() => {
      setRetryCountdown((prev) => (prev ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [retryCountdown]);

  const onSubmit = async (data: MealFormInput) => {
    if (retryCountdown !== null && retryCountdown > 0) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const res = await getCalories(data);
      setResult(res);
    } catch (error: any) {
      if (error instanceof ApiError) {
        if (error.status === 400) {
          setError("servings", {
            type: "manual",
            message: "Servings must be a positive number",
          });
        } else if (error.status === 404) {
          setApiError('Dish not found. Try a more specific or standard name (e.g., "Chicken breast" instead of "Chicken with special sauce").');
        } else if (error.status === 422) {
          setApiError("No calorie or nutritional information available for this dish. Please try another.");
        } else if (error.status === 429) {
          const waitTime = error.retryAfter || 60;
          setRetryCountdown(waitTime);
          setApiError(`Rate limit exceeded. Too many requests, try again in ${waitTime} seconds.`);
        } else {
          setApiError(error.message || "A server error occurred. Please try again later.");
        }
      } else {
        setApiError("Unable to connect to the server. Please check your network.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormDisabled = isLoading || (retryCountdown !== null && retryCountdown > 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md transition-all">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg">
          <Search className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Calorie Lookup</h2>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="dish_name" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Dish or Food Name
          </label>
          <input
            id="dish_name"
            type="text"
            {...register("dish_name")}
            className="w-full px-3.5 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-slate-200 dark:border-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm"
            placeholder="e.g., Pepperoni Pizza, Caesar Salad, Oatmeal"
            disabled={isFormDisabled}
          />
          {errors.dish_name && (
            <p className="text-xs text-red-500 mt-1">{errors.dish_name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="servings" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Number of Servings
          </label>
          <input
            id="servings"
            type="number"
            step="any"
            {...register("servings")}
            className="w-full px-3.5 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-slate-200 dark:border-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm"
            placeholder="e.g., 1, 1.5, 2.5"
            disabled={isFormDisabled}
          />
          {errors.servings && (
            <p className="text-xs text-red-500 mt-1">{errors.servings.message}</p>
          )}
        </div>

        {apiError && (
          <div className={`p-3 border rounded-lg flex items-start gap-2.5 text-sm transition-all ${
            retryCountdown !== null
              ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400"
              : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400"
          }`}>
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">{retryCountdown !== null ? "Rate Limited" : "Query Error"}</p>
              <p className="text-xs mt-0.5">{apiError}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isFormDisabled}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 dark:disabled:bg-amber-800 text-white font-semibold rounded-lg transition-colors cursor-pointer text-sm shadow-md"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Dish...</span>
            </>
          ) : retryCountdown !== null && retryCountdown > 0 ? (
            <span>Locked ({retryCountdown}s)</span>
          ) : (
            <span>Lookup Calories</span>
          )}
        </button>
      </form>
    </div>
  );
}

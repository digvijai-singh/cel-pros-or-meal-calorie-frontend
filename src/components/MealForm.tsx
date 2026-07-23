"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMealStore } from "@/stores/mealStore";
import { getCalories, ApiError } from "@/lib/api";
import { MealFormSchema, MealFormInput } from "@/lib/validations";
import { Loader2, AlertTriangle, Search } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="skeuo-card p-6 border border-slate-200/20 dark:border-slate-800/30"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white skeuo-button border-none">
          <Search className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-headline font-bold text-slate-800 dark:text-white">Calorie Lookup</h2>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-body">
        <div>
          <label htmlFor="dish_name" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            Dish or Food Name
          </label>
          <input
            id="dish_name"
            type="text"
            {...register("dish_name")}
            className="w-full px-3.5 py-2.5 border skeuo-input text-slate-800 dark:text-white focus:ring-0 outline-none text-sm"
            placeholder="e.g., Pepperoni Pizza, Caesar Salad, Oatmeal"
            disabled={isFormDisabled}
          />
          {errors.dish_name && (
            <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.dish_name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="servings" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            Number of Servings
          </label>
          <input
            id="servings"
            type="number"
            step="any"
            {...register("servings")}
            className="w-full px-3.5 py-2.5 border skeuo-input text-slate-800 dark:text-white focus:ring-0 outline-none text-sm"
            placeholder="e.g., 1, 1.5, 2.5"
            disabled={isFormDisabled}
          />
          {errors.servings && (
            <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.servings.message}</p>
          )}
        </div>

        {apiError && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 border rounded-xl flex items-start gap-2.5 text-xs transition-all ${
              retryCountdown !== null
                ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/50 text-amber-700 dark:text-amber-400"
                : "bg-red-50 dark:bg-red-950/20 border-red-200/50 dark:border-red-900/50 text-red-650 dark:text-red-400"
            }`}
          >
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">{retryCountdown !== null ? "Rate Limited" : "Query Error"}</p>
              <p className="text-[11px] mt-0.5">{apiError}</p>
            </div>
          </motion.div>
        )}

        <motion.button
          whileHover={isFormDisabled ? {} : { scale: 1.01, y: -1 }}
          whileTap={isFormDisabled ? {} : { scale: 0.98, y: 1 }}
          type="submit"
          disabled={isFormDisabled}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 skeuo-button text-white font-bold rounded-xl transition-all cursor-pointer text-sm"
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
        </motion.button>
      </form>
    </motion.div>
  );
}

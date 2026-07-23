"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMealStore } from "@/stores/mealStore";
import { getCalories, ApiError } from "@/lib/api";
import { MealFormSchema, MealFormInput } from "@/lib/validations";
import { Loader2, AlertTriangle, Search, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const PRESET_SUGGESTIONS = [
  "Grilled Salmon",
  "Paneer Butter Masala",
  "Chicken Biryani",
  "Avocado Toast",
  "Caesar Salad",
  "Oatmeal",
  "Protein Shake",
  "Greek Yogurt",
  "Mixed Nuts",
  "Butter Chicken",
  "Garlic Naan",
  "Mixed Salad"
];

export function MealForm() {
  const addToMeal = useMealStore((state) => state.addToMeal);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MealFormInput>({
    resolver: zodResolver(MealFormSchema) as any,
    defaultValues: {
      dish_name: "",
      servings: 1,
    },
  });

  const dishNameValue = watch("dish_name") || "";

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
    setShowDropdown(false);

    try {
      const res = await getCalories(data);
      addToMeal(res);
      setValue("dish_name", "");
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

  const filteredSuggestions = PRESET_SUGGESTIONS.filter((item) =>
    item.toLowerCase().includes(dishNameValue.toLowerCase())
  );

  const isFormDisabled = isLoading || (retryCountdown !== null && retryCountdown > 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="skeuo-card p-6 border border-slate-200/20 dark:border-slate-800/30"
    >
      <div className="flex items-center gap-3 mb-5 border-b border-slate-100 dark:border-slate-850 pb-3">
        <div className="w-8 h-8 bg-primary-container rounded-xl flex items-center justify-center text-white skeuo-button border-none">
          <Search className="w-4 h-4" />
        </div>
        <h2 className="text-base font-headline font-bold text-slate-800 dark:text-white">Meal Calorie Lookup</h2>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-body">
        {/* Dish Name with Autocomplete */}
        <div className="relative w-full">
          <label htmlFor="dish_name" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
            Dish Name
          </label>
          <input
            id="dish_name"
            type="text"
            {...register("dish_name")}
            autoComplete="off"
            className="w-full h-[48px] px-4 border skeuo-input text-slate-800 dark:text-white focus:ring-0 outline-none text-sm"
            placeholder="e.g., Grilled salmon or Chicken Biryani"
            disabled={isFormDisabled}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          
          <AnimatePresence>
            {showDropdown && dishNameValue.length >= 1 && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 w-full z-50 mt-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl shadow-[0_15px_35px_rgba(15,23,42,0.12)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.6)] overflow-hidden"
              >
                <div className="p-1 space-y-0.5 max-h-48 overflow-y-auto scroller">
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onMouseDown={() => {
                        setValue("dish_name", suggestion);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg transition-colors text-xs font-bold flex items-center gap-2 cursor-pointer focus:outline-none"
                    >
                      <History className="w-3.5 h-3.5 text-slate-400" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {errors.dish_name && (
            <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.dish_name.message}</p>
          )}
        </div>

        {/* Servings */}
        <div>
          <label htmlFor="servings" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
            Servings
          </label>
          <input
            id="servings"
            type="number"
            step="any"
            {...register("servings")}
            className="w-full h-[48px] px-4 border skeuo-input text-slate-800 dark:text-white focus:ring-0 outline-none text-sm"
            placeholder="e.g., 1, 2"
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

        <div className="pt-2">
          <motion.button
            whileHover={isFormDisabled ? {} : { scale: 1.01, y: -1 }}
            whileTap={isFormDisabled ? {} : { scale: 0.98, y: 1 }}
            type="submit"
            disabled={isFormDisabled}
            className="w-full h-[48px] flex items-center justify-center gap-2 skeuo-button text-white font-bold rounded-xl transition-all cursor-pointer text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Calculating...</span>
              </>
            ) : retryCountdown !== null && retryCountdown > 0 ? (
              <span>Locked ({retryCountdown}s)</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Lookup Meal</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

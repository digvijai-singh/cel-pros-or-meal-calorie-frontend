"use client";

import { useMealStore, MealBuilderItem } from "@/stores/mealStore";
import { Plus, Minus, X, Utensils } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MealSelectedItems() {
  const { currentMeal, updateQuantity, removeFromMeal } = useMealStore();

  const handleIncrement = (item: MealBuilderItem) => {
    updateQuantity(item.id, item.servings + 0.25);
  };

  const handleDecrement = (item: MealBuilderItem) => {
    if (item.servings > 0.25) {
      updateQuantity(item.id, item.servings - 0.25);
    }
  };

  if (currentMeal.length === 0) {
    return (
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[20px] p-8 text-center text-slate-500 dark:text-slate-400 min-h-[220px] flex flex-col justify-center items-center">
        <Utensils className="w-10 h-10 text-slate-400 dark:text-slate-600 mb-2" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-250">No items added to this meal yet</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Search for food above and they will appear here to build your meal.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {currentMeal.map((item) => (
          <motion.div
            layout
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="skeuo-card bg-white dark:bg-slate-900 rounded-[20px] p-5 flex flex-col gap-4 border border-slate-200/20 dark:border-slate-800/30"
          >
            {/* Header Area */}
            <div className="flex gap-4">
              {/* Image thumbnail */}
              {item.image && (
                <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-950 overflow-hidden shadow-inner flex-shrink-0 border border-slate-100 dark:border-slate-850">
                  <img
                    className="w-full h-full object-cover"
                    src={item.image}
                    alt={item.dish_name}
                  />
                </div>
              )}
              
              {/* Name & metadata */}
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-headline font-bold text-slate-800 dark:text-white truncate text-base">
                    {item.dish_name}
                  </h4>
                  <button
                    onClick={() => removeFromMeal(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
                
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {item.description || "Standard serving"} • {fmt(item.calories_per_serving)} kcal / serving
                </p>
              </div>
            </div>

            {/* Actions & Macros row */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-850">
              {/* Stepper quantity */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 rounded-full px-2 py-1 border border-slate-200/30 dark:border-slate-800">
                <button
                  onClick={() => handleDecrement(item)}
                  disabled={item.servings <= 0.25}
                  className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 text-primary dark:text-primary-light shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 transition-all cursor-pointer focus:outline-none"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-headline font-extrabold text-sm w-12 text-center text-slate-700 dark:text-white">
                  {item.servings.toFixed(2)}
                </span>
                <button
                  onClick={() => handleIncrement(item)}
                  className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 text-primary dark:text-primary-light shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-none"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Macro Chips */}
              <div className="flex gap-2">
                <div className="macro-chip bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 py-1 px-2.5 rounded-full text-[10px] font-bold border border-blue-100/10">
                  P: {fmt(item.total_macronutrients.protein)}g
                </div>
                <div className="macro-chip bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 py-1 px-2.5 rounded-full text-[10px] font-bold border border-emerald-100/10">
                  C: {fmt(item.total_macronutrients.carbohydrates)}g
                </div>
                <div className="macro-chip bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 py-1 px-2.5 rounded-full text-[10px] font-bold border border-amber-100/10">
                  F: {fmt(item.total_macronutrients.total_fat)}g
                </div>
              </div>
            </div>

          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

const fmt = (val: number) => Number(val).toFixed(0);

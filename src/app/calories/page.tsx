"use client";

import { Suspense } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useMealStore } from "@/stores/mealStore";
import { MealForm } from "@/components/MealForm";
import { MealSelectedItems } from "./MealSelectedItems";
import { MealSummary } from "./MealSummary";
import { Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CaloriesPage() {
  const { isAuthorized } = useAuthGuard();
  const { currentMeal } = useMealStore();

  if (!isAuthorized) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2 font-body">
      
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-850 pb-4 gap-2"
      >
        <div>
          <h1 className="text-2xl font-headline font-black tracking-tight text-slate-805 dark:text-white">
            Analyze Meal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {currentMeal.length > 0 
              ? `Currently building a meal with ${currentMeal.length} food item${currentMeal.length > 1 ? "s" : ""}.`
              : "Search and select food items below to construct your custom meal."}
          </p>
        </div>
        
        {currentMeal.length > 0 && (
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-primary dark:text-primary-fixed-dim bg-primary/5 dark:bg-primary-container/10 border border-primary/10 px-3 py-1 rounded-full self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Item Builder Active</span>
          </div>
        )}
      </motion.div>

      {/* Main Grid Layout (Stitch 60/40 Split Panel) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
        
        {/* Left Pane (7 columns): Search input & Selected Items list */}
        <div className="md:col-span-7 space-y-6">
          <MealForm />
          
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-450 dark:text-slate-505 uppercase tracking-wider ml-1">
              Selected Meal Items
            </h3>
            <MealSelectedItems />
          </div>
        </div>

        {/* Right Pane (5 columns): Total Meal Summary, Macros & Log CTA */}
        <div className="md:col-span-5">
          <Suspense fallback={
            <div className="skeuo-card p-6 bg-white dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800/30 rounded-[20px] shadow-md h-96 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          }>
            <MealSummary />
          </Suspense>
        </div>

      </div>

    </div>
  );
}

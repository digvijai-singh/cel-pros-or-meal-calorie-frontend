"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useMealStore } from "@/stores/mealStore";
import { MealForm } from "@/components/MealForm";
import { ResultCard } from "@/components/ResultCard";
import { Loader2, Apple } from "lucide-react";
import { motion } from "framer-motion";

export default function CaloriesPage() {
  const { isAuthorized } = useAuthGuard();
  const lastResult = useMealStore((state) => state.lastResult);

  if (!isAuthorized) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 font-body">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center md:text-left"
      >
        <h1 className="text-3xl font-headline font-bold tracking-tight text-slate-850 dark:text-white">
          Calorie Counter
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-450 mt-1.5 leading-relaxed">
          Enter a dish name and the number of servings to retrieve complete USDA calorie and macronutrient data.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        <MealForm />
        
        {lastResult ? (
          <ResultCard result={lastResult} />
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="skeuo-card p-8 text-center text-slate-400 dark:text-slate-500 border border-slate-205/20 dark:border-slate-805/30"
          >
            <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-105 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 flex items-center justify-center mb-3 shadow-inner">
              <Apple className="w-6 h-6 text-slate-350 dark:text-slate-600 animate-pulse" />
            </div>
            <p className="text-sm font-semibold">No dish analyzed yet</p>
            <p className="text-xs text-slate-400 mt-1">Use the form above to lookup calorie and macronutrient details.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

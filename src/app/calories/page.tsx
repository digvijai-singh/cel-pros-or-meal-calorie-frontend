"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useMealStore } from "@/stores/mealStore";
import { MealForm } from "@/components/MealForm";
import { ResultCard } from "@/components/ResultCard";
import { Loader2 } from "lucide-react";

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
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          Calorie Counter
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
          Enter a dish name and the number of servings to retrieve complete USDA calorie and macronutrient data.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <MealForm />
        
        {lastResult ? (
          <ResultCard result={lastResult} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 shadow-sm">
            <p className="text-sm font-medium">No dish analyzed yet. Use the form above to look up calories.</p>
          </div>
        )}
      </div>
    </div>
  );
}

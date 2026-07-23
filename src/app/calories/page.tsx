"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useMealStore } from "@/stores/mealStore";
import { MealForm } from "@/components/MealForm";
import { ResultCard } from "@/components/ResultCard";
import { Loader2, Apple, Lightbulb, History } from "lucide-react";
import { motion } from "framer-motion";
import { CalorieResult } from "@/types";
import { useRouter } from "next/navigation";

export default function CaloriesPage() {
  const { isAuthorized } = useAuthGuard();
  const { lastResult, history } = useMealStore();
  const router = useRouter();

  if (!isAuthorized) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Filter out the currently active result to show other items from search history
  const relatedSearches = history
    .filter((item) => item.dish_name !== lastResult?.dish_name)
    // De-duplicate by dish name
    .filter((item, idx, self) => self.findIndex(t => t.dish_name === item.dish_name) === idx)
    .slice(0, 3);

  const handleSelectRelated = (result: CalorieResult) => {
    useMealStore.getState().setTempResult(result);
    router.push("/calories/log");
  };

  const fmt = (val?: number) => (val !== undefined ? Number(val).toFixed(0) : "-");

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4 font-body">
      
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center md:text-left border-b border-slate-200/50 dark:border-slate-800/50 pb-3"
      >
        <h1 className="text-2xl font-headline font-bold tracking-tight text-slate-800 dark:text-white">
          Meal Calorie Studio
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          Powered by USDA FoodData Central with intelligent fuzzy search metrics.
        </p>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (41.6%): Form & Pro Tip */}
        <div className="lg:col-span-5 space-y-6">
          
          <MealForm />

          {/* Pro Tip Box */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="skeuo-card p-5 bg-emerald-500/5 dark:bg-emerald-500/5 border-l-4 border-emerald-500 flex items-start gap-4"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 shadow-inner">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase font-extrabold text-emerald-600 dark:text-emerald-500 tracking-wider">Pro Tip</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Adding "homemade" or specific ingredient counts to your search terms can provide more traditional nutritional averages.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Right Column (58.3%): Result Card & Related Searches */}
        <div className="lg:col-span-7 space-y-6">
          {lastResult ? (
            <div className="space-y-6">
              
              <ResultCard result={lastResult} />
              
              {/* Related Searches Section */}
              {relatedSearches.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-headline font-bold text-slate-700 dark:text-slate-200">
                      Related Recent Searches
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {relatedSearches.map((item, idx) => (
                      <motion.div
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        key={idx}
                        onClick={() => handleSelectRelated(item)}
                        className="skeuo-card p-4 flex flex-col items-center justify-center text-center group cursor-pointer border border-slate-200/20 dark:border-slate-800/30 hover:border-primary/30 transition-all select-none"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/5 dark:bg-primary-container/10 flex items-center justify-center text-primary mb-2 group-hover:scale-105 transition-transform shadow-inner">
                          <History className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate w-full">
                          {item.dish_name}
                        </p>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                          {fmt(item.total_calories)} kcal
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="skeuo-card p-8 text-center text-slate-500 dark:text-slate-405 border border-slate-200/25 dark:border-slate-800/30 min-h-[300px] flex flex-col justify-center items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 flex items-center justify-center mb-3 shadow-inner">
                <Apple className="w-6 h-6 text-slate-400 dark:text-slate-600 animate-pulse" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No dish analyzed yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Use the form on the left to lookup calorie and macronutrient details.</p>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}

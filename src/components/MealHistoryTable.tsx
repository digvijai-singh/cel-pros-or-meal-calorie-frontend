"use client";

import { useMealStore } from "@/stores/mealStore";
import { Trash2, Apple, ChevronRight, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { CalorieResult } from "@/types";

interface MealHistoryTableProps {
  onSelectMeal?: (meal: CalorieResult) => void;
}

export function MealHistoryTable({ onSelectMeal }: MealHistoryTableProps) {
  const { history, clearHistory } = useMealStore();
  const router = useRouter();

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your lookup history?")) {
      clearHistory();
    }
  };

  const handleClick = (result: CalorieResult) => {
    if (onSelectMeal) {
      onSelectMeal(result);
    } else {
      useMealStore.setState({ lastResult: result });
      router.push("/calories");
    }
  };

  const fmt = (val?: number) => (val !== undefined ? Number(val).toFixed(0) : "-");

  // Calculate daily progress dynamically from history logs for today
  const todayStr = new Date().toDateString();
  const todayMeals = history.filter((item) => {
    if (!item.timestamp) return false;
    return new Date(item.timestamp).toDateString() === todayStr;
  });
  const todayCalories = todayMeals.reduce((sum, item) => sum + item.total_calories, 0);
  const calorieTarget = 2000;
  const caloriePercent = Math.min((todayCalories / calorieTarget) * 100, 100);

  if (history.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="skeuo-card p-8 text-center text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800/30 h-full flex flex-col justify-center items-center"
      >
        <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 flex items-center justify-center mb-3 shadow-inner">
          <History className="w-6 h-6 text-slate-400 dark:text-slate-605" />
        </div>
        <p className="text-sm font-semibold font-body text-slate-705 dark:text-slate-200">No food lookups yet</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-body">Your searches will be logged here for easy access.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      id="recent-meals-widget"
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="skeuo-card border border-slate-200/25 dark:border-slate-800/30 flex flex-col h-full overflow-hidden"
    >
      {/* Card Header */}
      <div className="p-5 border-b border-slate-150 dark:border-slate-850 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/30 dark:border-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
            <History className="w-4 h-4" />
          </div>
          <h2 className="text-base font-headline font-bold text-slate-800 dark:text-white">Recent Meals</h2>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleClear}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200/30 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-rose-950/20 transition-all font-body text-[10px] font-bold cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </motion.button>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto max-h-[360px] scroller">
        <table className="w-full text-left border-collapse text-xs font-body">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-850/50 font-bold uppercase tracking-wider sticky top-0 backdrop-blur-sm z-10">
              <th className="py-3 px-5">Dish</th>
              <th className="py-3 px-3 text-right">Servings</th>
              <th className="py-3 px-5 text-right">Calories</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850/50">
            <AnimatePresence>
              {history.map((item, idx) => (
                <motion.tr
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                  key={item.timestamp || idx.toString()}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all duration-200 glass-row cursor-pointer"
                  onClick={() => handleClick(item)}
                >
                  <td className="py-3 px-5 font-bold text-slate-800 dark:text-slate-200 text-sm">
                    <span className="flex items-center gap-2.5">
                      <span className="p-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 border border-slate-200/50 dark:border-slate-700/50">
                        <Apple className="w-3.5 h-3.5" />
                      </span>
                      <span className="truncate max-w-[140px] sm:max-w-none">{item.dish_name}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400 font-semibold">{item.servings}</td>
                  <td className="py-3 px-5 text-right text-amber-600 dark:text-amber-500 font-extrabold text-sm flex items-center justify-end gap-1.5">
                    <span>{fmt(item.total_calories)} kcal</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Daily Progress Footer */}
      <div id="daily-progress-widget" className="p-5 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-150 dark:border-slate-850">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-body">
            <span className="text-slate-600 dark:text-slate-400 font-bold">Daily Calories Goal</span>
            <span className="font-extrabold text-primary dark:text-primary-light">
              {fmt(todayCalories)} / {fmt(calorieTarget)} kcal
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${caloriePercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(26,115,232,0.5)]"
            />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold text-center mt-1">
            {caloriePercent >= 100 
              ? "Daily calorie budget reached!" 
              : `${fmt(calorieTarget - todayCalories)} kcal remaining for today.`}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

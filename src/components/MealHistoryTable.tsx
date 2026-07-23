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

  if (history.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="skeuo-card p-8 text-center text-slate-400 dark:text-slate-500 border border-slate-205/20 dark:border-slate-805/30"
      >
        <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-105 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 flex items-center justify-center mb-3 shadow-inner">
          <History className="w-6 h-6 text-slate-350 dark:text-slate-600" />
        </div>
        <p className="text-sm font-semibold font-body">No food lookups yet</p>
        <p className="text-xs text-slate-400 mt-1 font-body">Your searches will be logged here for easy access.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="skeuo-card p-6 border border-slate-200/20 dark:border-slate-800/30"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white skeuo-button border-none">
            <History className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-headline font-bold text-slate-800 dark:text-white">Recent Queries</h2>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200/50 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-rose-950/20 transition-all font-body text-xs font-bold cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </motion.button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/50 dark:border-slate-800/50">
        <table className="w-full text-left border-collapse text-xs font-body">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-850 font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Dish</th>
              <th className="py-3 px-3 text-right">Servings</th>
              <th className="py-3 px-3 text-right">Total Calories</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850/80">
            <AnimatePresence>
              {history.map((item, idx) => (
                <motion.tr
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.4) }}
                  key={item.timestamp || idx.toString()}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all duration-200 glass-row cursor-pointer"
                  onClick={() => handleClick(item)}
                >
                  <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-200 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 border border-indigo-100 dark:border-indigo-900/50">
                        <Apple className="w-3.5 h-3.5" />
                      </span>
                      {item.dish_name}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-450 font-semibold">{item.servings}</td>
                  <td className="py-3 px-3 text-right text-amber-500 font-extrabold text-sm">{fmt(item.total_calories)} kcal</td>
                  <td className="py-3 px-4 text-center">
                    <motion.button
                      whileHover={{ x: 2 }}
                      className="inline-flex items-center gap-1 text-primary hover:text-primary-dark font-bold font-body text-xs cursor-pointer focus:outline-none"
                    >
                      <span>View</span>
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

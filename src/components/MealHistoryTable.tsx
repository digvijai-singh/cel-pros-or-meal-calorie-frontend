"use client";

import { useMealStore } from "@/stores/mealStore";
import { Trash2, History } from "lucide-react";
import { useEffect, useState } from "react";

export function MealHistoryTable() {
  const { history, clearHistory } = useMealStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="text-sm text-slate-400">Loading history...</div>;
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-slate-205 dark:border-slate-800 rounded-xl">
        <History className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
        <p className="text-sm text-slate-500 dark:text-slate-400">No search history found.</p>
      </div>
    );
  }

  const formatDate = (isoString?: string) => {
    if (!isoString) return "-";
    try {
      return new Date(isoString).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-850 dark:text-slate-150 flex items-center gap-1.5">
          <History className="w-5 h-5 text-amber-500" /> Recent Lookups
        </h3>
        <button
          onClick={clearHistory}
          className="text-xs flex items-center gap-1 text-red-500 hover:text-red-650 transition-colors py-1.5 px-2.5 rounded bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 border border-red-200/30 dark:border-red-900/30 font-semibold cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider">
              <th className="py-2.5 px-4">Dish Name</th>
              <th className="py-2.5 px-3 text-right">Servings</th>
              <th className="py-2.5 px-3 text-right">Calories</th>
              <th className="py-2.5 px-4 text-center">Date & Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
            {history.slice(0, 10).map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-950/30 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">{item.dish_name}</td>
                <td className="py-3 px-3 text-right text-slate-500">{item.servings}</td>
                <td className="py-3 px-3 text-right font-bold text-amber-500">{Number(item.total_calories).toFixed(1)} kcal</td>
                <td className="py-3 px-4 text-center text-slate-400 text-xs">{formatDate(item.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

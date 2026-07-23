"use client";

import { CalorieResult } from "@/types";
import { Info, Database, Apple, Activity, Award, Plus } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMealStore } from "@/stores/mealStore";

interface ResultCardProps {
  result: CalorieResult | null;
}

export function ResultCard({ result }: ResultCardProps) {
  if (!result) return null;

  const {
    dish_name,
    servings,
    data_source,
    calories_per_serving,
    total_calories,
    macronutrients_per_serving,
    total_macronutrients,
    ingredient_breakdown = [],
    matched_food,
  } = result;

  const fmt = (val?: number) => (val !== undefined ? Number(val).toFixed(1) : "-");

  const carbs = macronutrients_per_serving?.carbohydrates || 0;
  const protein = macronutrients_per_serving?.protein || 0;
  const fat = macronutrients_per_serving?.total_fat || 0;
  const totalMacros = carbs + protein + fat || 1;

  const carbsPct = (carbs / totalMacros) * 100;
  const proteinPct = (protein / totalMacros) * 100;
  const fatPct = (fat / totalMacros) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.97, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="w-full space-y-6"
    >
      {/* Overview Card */}
      <div className="skeuo-card p-6 border border-slate-200/20 dark:border-slate-800/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30 shadow-sm">
              <Apple className="w-3.5 h-3.5" /> Calorie Report
            </span>
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-slate-800 dark:text-white mt-2.5 tracking-tight">
              {dish_name}
            </h1>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1 font-body">
              <Database className="w-3.5 h-3.5" /> Source: {data_source || "USDA Database"}
            </p>
          </div>
          <div className="flex items-center gap-6 font-body">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Servings</p>
              <p className="text-2xl font-black text-slate-850 dark:text-white">{servings}</p>
            </div>
            <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
            <div className="text-right">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Energy</p>
              <p className="text-2xl font-black text-amber-500">{fmt(total_calories)} kcal</p>
            </div>
          </div>
        </div>

        {/* Calorie Stats Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Calorie Dial / Summary */}
          <div className="concave-display p-5 border border-slate-250/20 dark:border-slate-850/50 flex flex-col justify-between">
            <div className="font-body">
              <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Activity className="w-4 h-4 text-amber-500" /> Calories Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-550 dark:text-slate-400">Calories Per Serving</span>
                  <span className="font-bold text-slate-800 dark:text-white">{fmt(calories_per_serving)} kcal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-550 dark:text-slate-400">Total Calories ({servings} servings)</span>
                  <span className="font-bold text-amber-500">{fmt(total_calories)} kcal</span>
                </div>
              </div>
            </div>
            {/* Visual progress channel */}
            <div className="mt-6 font-body">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2">Macronutrient Ratio (Energy)</p>
              <div className="h-3.5 w-full rounded-full flex overflow-hidden bg-slate-200 dark:bg-slate-900 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${carbsPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-amber-400 hover:opacity-90 transition-opacity" 
                  title={`Carbs: ${fmt(carbsPct)}%`} 
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${proteinPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  className="bg-indigo-500 hover:opacity-90 transition-opacity" 
                  title={`Protein: ${fmt(proteinPct)}%`} 
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${fatPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className="bg-rose-500 hover:opacity-90 transition-opacity" 
                  title={`Fat: ${fmt(fatPct)}%`} 
                />
              </div>
              <div className="flex justify-between mt-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" /> Carbs</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm" /> Protein</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" /> Fats</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-body">
              <Award className="w-4 h-4 text-indigo-500" /> Macronutrient Details
            </h3>
            
            <div className="grid grid-cols-3 gap-3 font-body">
              {/* Protein */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-850 text-center relative overflow-hidden skeuo-pill">
                <div className="macro-chip-highlight bg-indigo-500" />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Protein</p>
                <p className="text-lg font-extrabold text-indigo-500 mt-1">{fmt(macronutrients_per_serving?.protein)}g</p>
                <p className="text-[9px] font-semibold text-slate-500 mt-0.5">Total: {fmt(total_macronutrients?.protein)}g</p>
              </div>

              {/* Carbs */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-850 text-center relative overflow-hidden skeuo-pill">
                <div className="macro-chip-highlight bg-amber-400" />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Carbs</p>
                <p className="text-lg font-extrabold text-amber-500 mt-1">{fmt(macronutrients_per_serving?.carbohydrates)}g</p>
                <p className="text-[9px] font-semibold text-slate-500 mt-0.5">Total: {fmt(total_macronutrients?.carbohydrates)}g</p>
              </div>

              {/* Fats */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-850 text-center relative overflow-hidden skeuo-pill">
                <div className="macro-chip-highlight bg-rose-500" />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Fats</p>
                <p className="text-lg font-extrabold text-rose-500 mt-1">{fmt(macronutrients_per_serving?.total_fat)}g</p>
                <p className="text-[9px] font-semibold text-slate-500 mt-0.5">Total: {fmt(total_macronutrients?.total_fat)}g</p>
              </div>
            </div>

            {/* Optional Macros */}
            {(macronutrients_per_serving?.fiber !== undefined ||
              macronutrients_per_serving?.sugars !== undefined ||
              macronutrients_per_serving?.saturated_fat !== undefined) && (
              <div className="concave-display p-3.5 border border-slate-200/20 dark:border-slate-850/50 space-y-2 font-body">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Additional Information</p>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  {macronutrients_per_serving?.fiber !== undefined && (
                    <div>
                      <span className="text-slate-600 dark:text-slate-400 block font-bold">Fiber:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-250">{fmt(macronutrients_per_serving.fiber)}g ({fmt(total_macronutrients?.fiber)}g)</span>
                    </div>
                  )}
                  {macronutrients_per_serving?.sugars !== undefined && (
                    <div>
                      <span className="text-slate-600 dark:text-slate-400 block font-bold">Sugars:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-250">{fmt(macronutrients_per_serving.sugars)}g ({fmt(total_macronutrients?.sugars)}g)</span>
                    </div>
                  )}
                  {macronutrients_per_serving?.saturated_fat !== undefined && (
                    <div>
                      <span className="text-slate-600 dark:text-slate-400 block font-bold">Sat. Fat:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-250">{fmt(macronutrients_per_serving.saturated_fat)}g ({fmt(total_macronutrients?.saturated_fat)}g)</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Log Meal CTA Button */}
            <div className="mt-6 border-t border-slate-150 dark:border-slate-800 pt-5">
              <Link href="/calories/log" passHref legacyBehavior>
                <motion.a 
                  onClick={() => useMealStore.getState().setTempResult(result)}
                  whileHover={{ scale: 1.01, y: -0.5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-11 btn-skeuo-primary rounded-xl text-white font-bold flex items-center justify-center gap-2 cursor-pointer text-xs shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log this Meal</span>
                </motion.a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredient Breakdown Table */}
      {ingredient_breakdown.length > 0 && (
        <div className="skeuo-card p-6 border border-slate-200/20 dark:border-slate-800/30">
          <h2 className="text-lg font-headline font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-500" /> Ingredient Breakdown
          </h2>
          <div className="overflow-x-auto scroller rounded-xl border border-slate-200/50 dark:border-slate-800/50">
            <table className="w-full text-left border-collapse text-xs font-body">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-850 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-xs">Ingredient</th>
                  <th className="py-3.5 px-3 text-right">Cals / 100g</th>
                  <th className="py-3.5 px-3 text-right">Protein / 100g</th>
                  <th className="py-3.5 px-3 text-right">Fats / 100g</th>
                  <th className="py-3.5 px-3 text-right">Carbs / 100g</th>
                  <th className="py-3.5 px-3 text-right">Serving Size</th>
                  <th className="py-3.5 px-4 text-center">FDC ID (Type)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850/80">
                {ingredient_breakdown.map((item, idx) => (
                   <motion.tr 
                     initial={{ opacity: 0, y: 8 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.3, delay: idx * 0.05 }}
                     key={idx} 
                     className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all duration-200 glass-row"
                   >
                     <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-205 text-sm">{item.name}</td>
                     <td className="py-3.5 px-3 text-right text-amber-600 dark:text-amber-500 font-bold">{fmt(item.calories_per_100g)} kcal</td>
                     <td className="py-3.5 px-3 text-right text-indigo-650 dark:text-indigo-500 font-bold">{fmt(item.macronutrients_per_100g?.protein)}g</td>
                     <td className="py-3.5 px-3 text-right text-rose-600 dark:text-rose-500 font-bold">{fmt(item.macronutrients_per_100g?.total_fat)}g</td>
                     <td className="py-3.5 px-3 text-right text-amber-600 dark:text-amber-500 font-bold">{fmt(item.macronutrients_per_100g?.carbohydrates)}g</td>
                     <td className="py-3.5 px-3 text-right text-slate-600 dark:text-slate-400 font-semibold">{fmt(item.serving_size)}g</td>
                     <td className="py-3.5 px-4 text-center">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
                         {item.fdc_id} ({item.data_type})
                       </span>
                     </td>
                   </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Matched Food Metadata */}
      {matched_food && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900/55 border border-slate-200/40 dark:border-slate-850/50 rounded-2xl flex flex-col sm:flex-row justify-between text-[11px] text-slate-600 dark:text-slate-400 gap-2 font-body shadow-sm">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-300">Matched Reference:</span> {matched_food.name}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span><strong>FDC ID:</strong> {matched_food.fdc_id}</span>
            <span><strong>Type:</strong> {matched_food.data_type}</span>
            <span><strong>Published:</strong> {matched_food.published_date}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

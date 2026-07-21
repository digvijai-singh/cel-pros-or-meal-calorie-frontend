"use client";

import { CalorieResult } from "@/types";
import { Info, Database, Apple, Activity, Award } from "lucide-react";

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

  // Calculate percentages for a simple visual breakdown
  const carbs = macronutrients_per_serving?.carbohydrates || 0;
  const protein = macronutrients_per_serving?.protein || 0;
  const fat = macronutrients_per_serving?.total_fat || 0;
  const totalMacros = carbs + protein + fat || 1;

  const carbsPct = (carbs / totalMacros) * 100;
  const proteinPct = (protein / totalMacros) * 100;
  const fatPct = (fat / totalMacros) * 100;

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30">
              <Apple className="w-3.5 h-3.5" /> Calorie Report
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mt-1">
              {dish_name}
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
              <Database className="w-3 h-3" /> Source: {data_source || "USDA Database"}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Servings</p>
              <p className="text-2xl font-black text-slate-800 dark:text-white">{servings}</p>
            </div>
            <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
            <div className="text-right">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Total Calories</p>
              <p className="text-2xl font-black text-amber-500">{fmt(total_calories)} kcal</p>
            </div>
          </div>
        </div>

        {/* Calorie Stats Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Calorie Dial / Summary */}
          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-5 border border-slate-100 dark:border-slate-850 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Activity className="w-4 h-4 text-amber-500" /> Calories Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-450">Calories Per Serving</span>
                  <span className="font-bold text-slate-800 dark:text-white">{fmt(calories_per_serving)} kcal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-450">Total Calories ({servings} servings)</span>
                  <span className="font-bold text-amber-500">{fmt(total_calories)} kcal</span>
                </div>
              </div>
            </div>
            {/* Visual stacked progress bar */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">Macronutrient Ratio (Energy)</p>
              <div className="h-3 w-full rounded-full flex overflow-hidden bg-slate-200 dark:bg-slate-850">
                <div style={{ width: `${carbsPct}%` }} className="bg-amber-400 hover:opacity-90 transition-opacity" title={`Carbs: ${fmt(carbsPct)}%`} />
                <div style={{ width: `${proteinPct}%` }} className="bg-indigo-500 hover:opacity-90 transition-opacity" title={`Protein: ${fmt(proteinPct)}%`} />
                <div style={{ width: `${fatPct}%` }} className="bg-rose-500 hover:opacity-90 transition-opacity" title={`Fat: ${fmt(fatPct)}%`} />
              </div>
              <div className="flex justify-between mt-2.5 text-[11px] font-medium text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Carbs</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Protein</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Fats</span>
              </div>
            </div>
          </div>

          {/* Macro grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-500" /> Macronutrient Details
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {/* Protein */}
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-850 text-center">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Protein</p>
                <p className="text-lg font-extrabold text-indigo-500 mt-1">{fmt(macronutrients_per_serving?.protein)}g</p>
                <p className="text-[10px] text-slate-450 mt-0.5">Total: {fmt(total_macronutrients?.protein)}g</p>
              </div>

              {/* Carbs */}
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-850 text-center">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Carbs</p>
                <p className="text-lg font-extrabold text-amber-500 mt-1">{fmt(macronutrients_per_serving?.carbohydrates)}g</p>
                <p className="text-[10px] text-slate-450 mt-0.5">Total: {fmt(total_macronutrients?.carbohydrates)}g</p>
              </div>

              {/* Fats */}
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-850 text-center">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Total Fat</p>
                <p className="text-lg font-extrabold text-rose-500 mt-1">{fmt(macronutrients_per_serving?.total_fat)}g</p>
                <p className="text-[10px] text-slate-450 mt-0.5">Total: {fmt(total_macronutrients?.total_fat)}g</p>
              </div>
            </div>

            {/* Optional Macros */}
            {(macronutrients_per_serving?.fiber !== undefined ||
              macronutrients_per_serving?.sugars !== undefined ||
              macronutrients_per_serving?.saturated_fat !== undefined) && (
              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-100 dark:border-slate-850 space-y-2">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Additional Information</p>
                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  {macronutrients_per_serving?.fiber !== undefined && (
                    <div>
                      <span className="text-slate-500 block">Fiber:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{fmt(macronutrients_per_serving.fiber)}g ({fmt(total_macronutrients?.fiber)}g)</span>
                    </div>
                  )}
                  {macronutrients_per_serving?.sugars !== undefined && (
                    <div>
                      <span className="text-slate-500 block">Sugars:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{fmt(macronutrients_per_serving.sugars)}g ({fmt(total_macronutrients?.sugars)}g)</span>
                    </div>
                  )}
                  {macronutrients_per_serving?.saturated_fat !== undefined && (
                    <div>
                      <span className="text-slate-500 block">Sat. Fat:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{fmt(macronutrients_per_serving.saturated_fat)}g ({fmt(total_macronutrients?.saturated_fat)}g)</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ingredient Breakdown Table */}
      {ingredient_breakdown.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md transition-all">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-1.5">
            <Info className="w-5 h-5 text-amber-500" /> Ingredient Breakdown
          </h2>
          <div className="overflow-x-auto scroller rounded-lg border border-slate-100 dark:border-slate-850">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-850 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Ingredient Name</th>
                  <th className="py-3 px-3 text-right">Calories / 100g</th>
                  <th className="py-3 px-3 text-right">Protein / 100g</th>
                  <th className="py-3 px-3 text-right">Fats / 100g</th>
                  <th className="py-3 px-3 text-right">Carbs / 100g</th>
                  <th className="py-3 px-3 text-right">Serving Size</th>
                  <th className="py-3 px-4 text-center">FDC ID (Source)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {ingredient_breakdown.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">{item.name}</td>
                    <td className="py-3.5 px-3 text-right text-amber-500 font-bold">{fmt(item.calories_per_100g)} kcal</td>
                    <td className="py-3.5 px-3 text-right text-indigo-500 font-semibold">{fmt(item.macronutrients_per_100g?.protein)}g</td>
                    <td className="py-3.5 px-3 text-right text-rose-500 font-semibold">{fmt(item.macronutrients_per_100g?.total_fat)}g</td>
                    <td className="py-3.5 px-3 text-right text-amber-500 font-semibold">{fmt(item.macronutrients_per_100g?.carbohydrates)}g</td>
                    <td className="py-3.5 px-3 text-right text-slate-500">{fmt(item.serving_size)}g</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.fdc_id} ({item.data_type})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Matched Food Metadata */}
      {matched_food && (
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl flex flex-col sm:flex-row justify-between text-xs text-slate-550 dark:text-slate-450 gap-2">
          <div>
            <span className="font-bold text-slate-700 dark:text-slate-350">Matched Reference:</span> {matched_food.name}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span><strong>FDC ID:</strong> {matched_food.fdc_id}</span>
            <span><strong>Type:</strong> {matched_food.data_type}</span>
            <span><strong>Published:</strong> {matched_food.published_date}</span>
          </div>
        </div>
      )}
    </div>
  );
}

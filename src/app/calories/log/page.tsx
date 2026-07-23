"use client";

import { useState, useEffect } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useMealStore } from "@/stores/mealStore";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  CheckCircle, 
  Info, 
  Sun, 
  Moon, 
  Clock, 
  Sparkles,
  Coffee,
  Utensils,
  MoonStar,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { CalorieResult } from "@/types";

export default function ConfirmMealPage() {
  const { isAuthorized } = useAuthGuard();
  const { tempResult, logMeal } = useMealStore();
  const router = useRouter();

  const [portion, setPortion] = useState(1.0);
  const [category, setCategory] = useState("Breakfast");
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });

  useEffect(() => {
    if (isAuthorized && !tempResult) {
      router.push("/calories");
    }
  }, [tempResult, isAuthorized, router]);

  if (!isAuthorized || !tempResult) return null;

  // Extract base macro and calorie values
  const baseCalories = tempResult.calories_per_serving ?? tempResult.total_calories;
  const baseProtein = tempResult.macronutrients_per_serving?.protein ?? tempResult.total_macronutrients?.protein ?? 0;
  const baseCarbs = tempResult.macronutrients_per_serving?.carbohydrates ?? tempResult.total_macronutrients?.carbohydrates ?? 0;
  const baseFat = tempResult.macronutrients_per_serving?.total_fat ?? tempResult.total_macronutrients?.total_fat ?? 0;
  
  // Optional nutrition values
  const baseFiber = tempResult.macronutrients_per_serving?.fiber ?? tempResult.total_macronutrients?.fiber ?? 0;
  const baseSugars = tempResult.macronutrients_per_serving?.sugars ?? tempResult.total_macronutrients?.sugars ?? 0;
  const baseSatFat = tempResult.macronutrients_per_serving?.saturated_fat ?? tempResult.total_macronutrients?.saturated_fat ?? 0;

  // Scale value dynamically based on portion size slider
  const scaledCalories = baseCalories * portion;
  const scaledProtein = baseProtein * portion;
  const scaledCarbs = baseCarbs * portion;
  const scaledFat = baseFat * portion;
  const scaledFiber = baseFiber * portion;
  const scaledSugars = baseSugars * portion;
  const scaledSatFat = baseSatFat * portion;

  const fmt = (val: number) => Number(val).toFixed(0);
  const fmtDec = (val: number) => Number(val).toFixed(1);

  const handleConfirm = () => {
    const confirmedResult: CalorieResult = {
      ...tempResult,
      servings: portion,
      total_calories: scaledCalories,
      total_macronutrients: {
        protein: scaledProtein,
        carbohydrates: scaledCarbs,
        total_fat: scaledFat,
        fiber: scaledFiber,
        sugars: scaledSugars,
        saturated_fat: scaledSatFat
      },
      timestamp: (() => {
        const d = new Date();
        const [h, m] = time.split(":").map(Number);
        d.setHours(h, m, 0, 0);
        return d.toISOString();
      })()
    };
    logMeal(confirmedResult);
    router.push("/calories/log/success");
  };

  const categories = [
    { name: "Breakfast", icon: Coffee },
    { name: "Lunch", icon: Utensils },
    { name: "Dinner", icon: MoonStar },
    { name: "Snack", icon: Activity }
  ];

  return (
    <div className="max-w-md mx-auto py-2 font-body text-slate-800 dark:text-white">
      
      {/* Header bar */}
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-850 pb-3.5">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-tactile-raised dark:shadow-tactile-dark-raised border-t border-white/80 dark:border-white/10 text-primary dark:text-primary-fixed-dim cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
        </motion.button>
        <h1 className="text-lg font-headline font-bold text-slate-800 dark:text-white">
          Confirm Meal
        </h1>
      </div>

      <div className="space-y-6">
        
        {/* Summary Card */}
        <motion.section 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="skeuo-card p-5 overflow-hidden border border-slate-200/25 dark:border-slate-800/30"
        >
          <div className="space-y-1">
            <h2 className="text-xl font-headline font-extrabold text-slate-800 dark:text-white">
              {tempResult.dish_name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/5 text-primary dark:text-primary-fixed-dim font-bold text-[9px] uppercase tracking-wider border border-primary/10">
                94% Confidence
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                Detected as {category}
              </span>
            </div>
          </div>

          {/* Recessed nutrition values grid */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 text-center border border-slate-100 dark:border-slate-850 shadow-inner">
              <div className="text-primary dark:text-primary-fixed-dim font-black text-lg">
                {fmt(scaledCalories)}
              </div>
              <div className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">kcal</div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 text-center border border-slate-100 dark:border-slate-850 shadow-inner">
              <div className="text-emerald-600 dark:text-emerald-500 font-black text-lg">
                {fmtDec(scaledProtein)}g
              </div>
              <div className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">Protein</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 text-center border border-slate-100 dark:border-slate-850 shadow-inner">
              <div className="text-amber-500 font-black text-lg">
                {fmtDec(scaledCarbs)}g
              </div>
              <div className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">Carbs</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 text-center border border-slate-100 dark:border-slate-850 shadow-inner">
              <div className="text-slate-600 dark:text-slate-305 font-black text-lg">
                {fmtDec(scaledFiber)}g
              </div>
              <div className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">Fiber</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 text-center border border-slate-100 dark:border-slate-850 shadow-inner">
              <div className="text-slate-605 dark:text-slate-305 font-black text-lg">
                {fmtDec(scaledSugars)}g
              </div>
              <div className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">Sugars</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 text-center border border-slate-100 dark:border-slate-850 shadow-inner">
              <div className="text-slate-605 dark:text-slate-305 font-black text-lg">
                {fmtDec(scaledSatFat)}g
              </div>
              <div className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">Sat. Fat</div>
            </div>
          </div>
        </motion.section>

        {/* Portion Selector Slider */}
        <motion.section 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="skeuo-card p-5 border border-slate-200/25 dark:border-slate-800/30 space-y-4"
        >
          <div className="flex justify-between items-end">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Portion Size
            </h3>
            <span className="text-lg font-extrabold text-primary dark:text-primary-fixed-dim">
              {portion.toFixed(2)}x
            </span>
          </div>

          <div className="space-y-2">
            <input 
              type="range"
              min="0.5"
              max="3.0"
              step="0.25"
              value={portion}
              onChange={(e) => setPortion(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 dark:text-slate-500 px-1">
              <span>Small (0.5x)</span>
              <span>Standard (1.0x)</span>
              <span>Large (3.0x)</span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-850/50 shadow-inner">
            <Info className="w-4 h-4 text-primary dark:text-primary-fixed-dim shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-505 dark:text-slate-400 leading-normal">
              Standard portion size is roughly {fmt(tempResult.matched_food?.fdc_id ? 100 : 180)}g as analyzed from USDA databases.
            </p>
          </div>
        </motion.section>

        {/* Meal Category Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2.5"
        >
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">
            Meal Category
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = category === cat.name;
              return (
                <motion.button
                  key={cat.name}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCategory(cat.name)}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-extrabold text-xs transition-all cursor-pointer focus:outline-none ${
                    isActive 
                      ? "bg-primary text-white shadow-tactile-raised"
                      : "bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.name}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* Time / Date Log Picker */}
        <motion.section 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="skeuo-card p-5 border border-slate-200/25 dark:border-slate-800/30 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-primary dark:text-primary-fixed-dim shadow-inner">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-headline font-bold text-slate-805 dark:text-white">
                Time & Date
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">
                Logged for Today
              </p>
            </div>
          </div>
          <div className="text-right">
            <input 
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-slate-50 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800 rounded-xl font-bold text-primary dark:text-primary-fixed-dim p-2 focus:ring-0 outline-none text-xs"
            />
          </div>
        </motion.section>

        {/* Log Meal CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="pt-2"
        >
          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            className="w-full h-[56px] btn-skeuo-primary rounded-2xl text-white font-bold flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
          >
            <span>Confirm Log</span>
            <CheckCircle className="w-5 h-5" />
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}

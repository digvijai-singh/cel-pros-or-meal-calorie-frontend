"use client";

import { useState, useEffect } from "react";
import { useMealStore } from "@/stores/mealStore";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Clock, Info, Coffee, Utensils, Moon, Activity } from "lucide-react";
import { motion } from "framer-motion";

export function MealSummary() {
  const { currentMeal, logCurrentMeal } = useMealStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });
  
  const categoryParam = searchParams.get("category");
  const [category, setCategory] = useState("Lunch");
  
  useEffect(() => {
    const validCategories = ["Breakfast", "Lunch", "Dinner", "Snack"];
    if (categoryParam && validCategories.includes(categoryParam)) {
      setCategory(categoryParam);
    }
  }, [categoryParam]);

  const [isLogging, setIsLogging] = useState(false);

  // Derived Totals
  const totalCalories = currentMeal.reduce((sum, item) => sum + item.total_calories, 0);
  const totalProtein = currentMeal.reduce((sum, item) => sum + item.total_macronutrients.protein, 0);
  const totalCarbs = currentMeal.reduce((sum, item) => sum + item.total_macronutrients.carbohydrates, 0);
  const totalFat = currentMeal.reduce((sum, item) => sum + item.total_macronutrients.total_fat, 0);

  // Daily guidelines targets
  const dailyTargetCalories = 2400;
  const targetProtein = 80;
  const targetCarbs = 180;
  const targetFat = 60;

  // Percentage accounts
  const dailyCaloriePercent = Math.min((totalCalories / dailyTargetCalories) * 100, 100);
  const proteinPercent = Math.min((totalProtein / targetProtein) * 100, 100);
  const carbsPercent = Math.min((totalCarbs / targetCarbs) * 100, 100);
  const fatPercent = Math.min((totalFat / targetFat) * 100, 100);

  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(totalCalories / dailyTargetCalories, 1);
  const strokeDashoffset = circumference - progressRatio * circumference;

  const handleConfirm = async () => {
    if (currentMeal.length === 0) return;
    setIsLogging(true);
    
    // Simulate slight delay for tactile feedback
    setTimeout(() => {
      logCurrentMeal(time, category);
      setIsLogging(false);
      router.push("/calories/log/success");
    }, 1000);
  };

  const categories = [
    { name: "Breakfast", icon: Coffee },
    { name: "Lunch", icon: Utensils },
    { name: "Dinner", icon: Moon },
    { name: "Snack", icon: Activity }
  ];

  return (
    <div className="space-y-6">
      
      {/* Primary Summary Card */}
      <div className="tactile-card p-6 bg-white dark:bg-slate-900 border-2 border-primary/10 dark:border-slate-800/80 rounded-[20px] shadow-xl">
        <h2 className="font-headline text-lg font-black text-slate-800 dark:text-white mb-6">
          Meal Summary
        </h2>
        
        {/* Total Calories Circular Dial */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform">
              <circle 
                className="text-slate-100 dark:text-slate-800 transition-colors" 
                cx="96" 
                cy="96" 
                fill="transparent" 
                r={radius} 
                stroke="currentColor" 
                strokeWidth="12"
              />
              <motion.circle 
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-primary dark:text-primary-fixed-dim" 
                cx="96" 
                cy="96" 
                fill="transparent" 
                r={radius} 
                stroke="currentColor" 
                strokeDasharray={circumference} 
                strokeLinecap="round" 
                strokeWidth="12"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[42px] font-headline font-black text-slate-800 dark:text-white leading-none">
                {fmt(totalCalories)}
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 mt-2 tracking-widest">
                Total Calories
              </span>
            </div>
          </div>
        </div>

        {/* Macro Progress Bars */}
        <div className="space-y-6 mb-8 font-body">
          {/* Protein */}
          <div>
            <div className="flex justify-between mb-1.5 text-xs">
              <span className="font-bold text-blue-700 dark:text-blue-400">Protein</span>
              <span className="font-extrabold text-slate-700 dark:text-white">{fmt(totalProtein)}g / {targetProtein}g</span>
            </div>
            <div className="progress-channel h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${proteinPercent}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]"
              />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex justify-between mb-1.5 text-xs">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Carbohydrates</span>
              <span className="font-extrabold text-slate-700 dark:text-white">{fmt(totalCarbs)}g / {targetCarbs}g</span>
            </div>
            <div className="progress-channel h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${carbsPercent}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"
              />
            </div>
          </div>

          {/* Fat */}
          <div>
            <div className="flex justify-between mb-1.5 text-xs">
              <span className="font-bold text-amber-700 dark:text-amber-500">Fat</span>
              <span className="font-extrabold text-slate-700 dark:text-white">{fmt(totalFat)}g / {targetFat}g</span>
            </div>
            <div className="progress-channel h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${fatPercent}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.4)]"
              />
            </div>
          </div>
        </div>

        {/* Nutritional Warning/Tip note */}
        {totalCalories > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-start gap-3 mb-6 shadow-inner">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              This meal accounts for {fmt(dailyCaloriePercent)}% of your daily calorie goal. 
              {dailyCaloriePercent > 50 
                ? " Consider a lighter side or logging smaller portion values."
                : " This fits nicely within your healthy nutrition boundaries."}
            </p>
          </div>
        )}

        {/* Confirm Action Button */}
        <motion.button 
          whileHover={currentMeal.length > 0 ? { scale: 1.01, y: -0.5 } : {}}
          whileTap={currentMeal.length > 0 ? { scale: 0.99 } : {}}
          onClick={handleConfirm}
          disabled={currentMeal.length === 0 || isLogging}
          className="btn-skeuo-primary w-full h-[52px] rounded-2xl font-headline font-black text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none shadow-lg text-white"
        >
          {isLogging ? (
            <span className="animate-pulse">Logging Meal...</span>
          ) : (
            <>
              <CheckCircle className="w-4.5 h-4.5" />
              <span>Confirm Log All Items</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Category selection & Time of Meal Card */}
      <div className="tactile-card p-5 bg-white dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800/30 rounded-[20px] space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 dark:bg-primary-container/10 rounded-xl text-primary dark:text-primary-fixed-dim shadow-inner">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Meal Schedule
              </p>
              <p className="text-xs font-black text-slate-700 dark:text-white mt-0.5">
                {category} • {time}
              </p>
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-850">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = category === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`py-2 rounded-xl flex flex-col items-center gap-1 font-bold text-[9px] transition-all cursor-pointer focus:outline-none border ${
                  isActive 
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-slate-850 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Inline time picker */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="font-semibold text-slate-400">Custom Log Time</span>
          <input 
            type="time" 
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl font-bold text-primary dark:text-primary-fixed-dim p-2 focus:ring-0 outline-none text-xs"
          />
        </div>
      </div>

    </div>
  );
}

const fmt = (val: number) => Number(val).toFixed(0);

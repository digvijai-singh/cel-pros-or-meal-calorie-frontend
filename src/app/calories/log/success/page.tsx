"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useMealStore } from "@/stores/mealStore";
import { useRouter } from "next/navigation";
import { 
  Check, 
  LayoutDashboard, 
  Utensils, 
  Settings, 
  Activity, 
  Flame, 
  Zap, 
  LineChart 
} from "lucide-react";
import { motion } from "framer-motion";

export default function LogMealSuccessPage() {
  const { isAuthorized } = useAuthGuard();
  const { history } = useMealStore();
  const router = useRouter();

  const latestMeal = history[0];

  useEffect(() => {
    if (isAuthorized && !latestMeal) {
      router.push("/calories");
    }
  }, [latestMeal, isAuthorized, router]);

  if (!isAuthorized || !latestMeal) return null;

  const fmt = (val?: number) => (val !== undefined ? Number(val).toFixed(0) : "0");

  // Calculate daily calories logged today
  const todayStr = new Date().toDateString();
  const todayMeals = history.filter((item) => {
    if (!item.timestamp) return false;
    return new Date(item.timestamp).toDateString() === todayStr;
  });
  const todayCalories = todayMeals.reduce((sum, item) => sum + item.total_calories, 0);

  // SVG circular dial parameters
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const targetCalories = 2000;
  const progressRatio = Math.min(latestMeal.total_calories / targetCalories, 1);
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 min-h-[calc(100vh-64px)] flex font-body bg-[#f8f9fb] dark:bg-[#020617] text-slate-850 dark:text-white select-none">
      
      {/* DESKTOP SIDEBAR + CANVAS LAYOUT */}
      <div className="hidden md:flex w-full h-full min-h-[calc(100vh-64px)]">
        {/* Left Side Navigation Bar */}
        <aside className="w-64 border-r border-slate-200/60 dark:border-slate-800 bg-[#f3f4f6] dark:bg-[#0b1120] p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div>
              <h2 className="font-headline text-lg font-black text-primary dark:text-primary-fixed leading-tight">
                Meal Calorie Studio
              </h2>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
                Health Dashboard
              </p>
            </div>
            
            <nav className="space-y-1.5 pt-4">
              <button 
                onClick={() => router.push("/dashboard")}
                className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-2xl font-extrabold text-xs shadow-md transition-all cursor-pointer focus:outline-none"
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
                <span>Dashboard</span>
              </button>
              
              <button 
                onClick={() => router.push("/calories")}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/55 dark:hover:bg-slate-800 rounded-2xl font-bold text-xs transition-all cursor-pointer focus:outline-none text-left"
              >
                <Utensils className="w-4.5 h-4.5" />
                <span>Meal Log</span>
              </button>
              
              <button 
                onClick={() => router.push("/dashboard")}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/55 dark:hover:bg-slate-800 rounded-2xl font-bold text-xs transition-all cursor-pointer focus:outline-none text-left"
              >
                <LineChart className="w-4.5 h-4.5" />
                <span>Nutrition</span>
              </button>
              
              <button 
                onClick={() => router.push("/dashboard")}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/55 dark:hover:bg-slate-800 rounded-2xl font-bold text-xs transition-all cursor-pointer focus:outline-none text-left"
              >
                <Settings className="w-4.5 h-4.5" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Desktop Main Canvas */}
        <main className="flex-1 flex flex-col items-center justify-center p-8 bg-[#f8f9fb] dark:bg-[#020617] relative">
          
          {/* Subtle Atmosphere circles */}
          <div className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-40 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 blur-[90px] rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 blur-[90px] rounded-full"></div>
          </div>

          <div className="space-y-8 z-10 w-full max-w-[480px]">
            {/* Desktop Success Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="skeuo-card bg-white dark:bg-slate-900 rounded-[32px] p-10 flex flex-col items-center text-center border dark:border-white/5 shadow-xl w-full"
            >
              {/* Checkmark wrapper */}
              <motion.div 
                initial={{ scale: 0.8, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
                className="w-24 h-24 rounded-full bg-white dark:bg-slate-850 flex items-center justify-center mb-8 success-checkmark-container border border-emerald-500/10 shadow-lg"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.3 }}
                  className="w-12 h-12 rounded-full bg-emerald-500/5 flex items-center justify-center"
                >
                  <Check className="w-8 h-8 text-emerald-600 stroke-[3.5]" />
                </motion.div>
              </motion.div>

              <h1 className="text-2xl font-headline font-black text-slate-800 dark:text-white mb-4">
                Meal Logged Successfully
              </h1>
              
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 leading-relaxed max-w-[320px]">
                <span className="font-extrabold text-primary dark:text-primary-fixed-dim">
                  {latestMeal.dish_name} ({fmt(latestMeal.total_calories)} kcal)
                </span>{" "}
                has been added to your dashboard.
              </p>

              {/* Actions */}
              <div className="w-full space-y-4">
                <motion.button 
                  whileHover={{ scale: 1.01, y: -0.5 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => router.push("/dashboard")}
                  className="skeuo-button-primary w-full h-[52px] rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.01, y: -0.5 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => router.push("/calories")}
                  className="skeuo-button-secondary w-full h-[52px] rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Log Another Meal</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Stats side-by-side cards */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="skeuo-raised px-5 py-4 rounded-2xl flex items-center gap-3 border border-slate-200/40 dark:border-slate-850">
                <div className="w-2.5 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex flex-col justify-end overflow-hidden">
                  <motion.div 
                    initial={{ height: "0%" }}
                    animate={{ height: `${Math.min((todayCalories / 2400) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="w-full bg-primary"
                  />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Daily Progress
                  </p>
                  <p className="text-xs font-black text-slate-700 dark:text-white mt-0.5">
                    {fmt(todayCalories)} / 2,400 kcal
                  </p>
                </div>
              </div>

              <div className="skeuo-raised px-5 py-4 rounded-2xl flex items-center gap-3 border border-slate-200/40 dark:border-slate-850">
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-500">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Streak
                  </p>
                  <p className="text-xs font-black text-slate-700 dark:text-white mt-0.5">
                    12 Days
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          
        </main>
      </div>

      {/* MOBILE SUCCESS LAYOUT */}
      <div className="flex md:hidden flex-col items-center justify-center w-full px-4 py-8">
        
        {/* Success Card container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="w-full max-w-sm skeuo-card bg-white dark:bg-slate-900 rounded-[32px] p-6 flex flex-col items-center text-center border dark:border-white/5 transition-colors duration-300"
        >
          {/* Green check badge */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-emerald-100/50 dark:bg-emerald-500/10 flex items-center justify-center mb-6 shadow-inner border border-emerald-500/10"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg border border-emerald-600">
              <Check className="w-10 h-10 text-white stroke-[4.5]" />
            </div>
          </motion.div>

          <h1 className="text-2xl font-headline font-black text-slate-800 dark:text-white mb-2">
            Great Progress!
          </h1>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 px-2 leading-normal">
            Your <span className="font-extrabold text-slate-800 dark:text-white">{latestMeal.dish_name}</span> ({fmt(latestMeal.total_calories)} kcal) is logged.
          </p>

          {/* Macro Summary Visualization */}
          <div className="w-full space-y-6">
            {/* Macro Radial Dial progress */}
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle 
                  className="text-slate-105 dark:text-slate-800 transition-colors" 
                  cx="50" 
                  cy="50" 
                  fill="transparent" 
                  r={radius} 
                  stroke="currentColor" 
                  strokeWidth="8"
                />
                <motion.circle 
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="text-primary dark:text-primary-fixed-dim" 
                  cx="50" 
                  cy="50" 
                  fill="transparent" 
                  r={radius} 
                  stroke="currentColor" 
                  strokeDasharray={circumference} 
                  strokeLinecap="round" 
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-850 dark:text-white leading-none">
                  {fmt(latestMeal.total_calories)}
                </span>
                <span className="text-[8px] uppercase font-black text-slate-400 mt-1 tracking-widest">
                  KCAL
                </span>
              </div>
            </div>

            {/* Macro P-C-F Chips */}
            <div className="flex justify-between gap-3 px-1">
              <div className="flex-1 macro-chip bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-white/50 dark:border-white/5 text-center">
                <span className="block font-black text-[9px] text-emerald-600 dark:text-emerald-500 mb-0.5">P</span>
                <span className="font-extrabold text-sm text-slate-805 dark:text-white">
                  {fmt(latestMeal.total_macronutrients?.protein)}g
                </span>
              </div>
              
              <div className="flex-1 macro-chip bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-white/50 dark:border-white/5 text-center">
                <span className="block font-black text-[9px] text-amber-500 mb-0.5">C</span>
                <span className="font-extrabold text-sm text-slate-855 dark:text-white">
                  {fmt(latestMeal.total_macronutrients?.carbohydrates)}g
                </span>
              </div>
              
              <div className="flex-1 macro-chip bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-white/50 dark:border-white/5 text-center">
                <span className="block font-black text-[9px] text-rose-500 mb-0.5">F</span>
                <span className="font-extrabold text-sm text-slate-855 dark:text-white">
                  {fmt(latestMeal.total_macronutrients?.total_fat)}g
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile Sticky Actions */}
        <div className="w-full max-w-sm mt-8 space-y-4 px-4">
          <motion.button 
            whileHover={{ scale: 1.01, y: -0.5 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => router.push("/dashboard")}
            className="w-full h-[52px] skeuo-button text-white font-headline font-black rounded-2xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
          >
            Done
          </motion.button>
          
          <button 
            onClick={() => router.push("/dashboard")}
            className="block w-full text-center py-2 text-primary dark:text-primary-fixed font-label font-bold hover:underline active:scale-95 transition-all text-xs focus:outline-none"
          >
            View Dashboard
          </button>
        </div>

      </div>

    </div>
  );
}

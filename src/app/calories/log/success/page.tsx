"use client";

import { useEffect } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useMealStore } from "@/stores/mealStore";
import { useRouter } from "next/navigation";
import { 
  CheckCircle, 
  ArrowRight, 
  LayoutDashboard, 
  Plus, 
  Flame,
  Award,
  Zap
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

  // Calculate daily calories logged today for the status indicator
  const todayStr = new Date().toDateString();
  const todayMeals = history.filter((item) => {
    if (!item.timestamp) return false;
    return new Date(item.timestamp).toDateString() === todayStr;
  });
  const todayCalories = todayMeals.reduce((sum, item) => sum + item.total_calories, 0);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] py-6 font-body text-slate-850 dark:text-white relative overflow-hidden select-none">
      
      {/* Background blur effects */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-40 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 dark:bg-primary/5 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 blur-[100px] rounded-full"></div>
      </div>

      {/* Success Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="w-full max-w-sm skeuo-card bg-white dark:bg-slate-900 rounded-[32px] p-8 flex flex-col items-center text-center border dark:border-white/5 shadow-2xl relative z-10"
      >
        {/* Animated Checkmark Wrapper */}
        <motion.div 
          initial={{ rotate: -90, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-24 h-24 rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 flex items-center justify-center mb-6 shadow-inner border border-emerald-500/20"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          >
            <CheckCircle className="w-14 h-14 text-emerald-550 dark:text-emerald-500 fill-current bg-white dark:bg-slate-900 rounded-full" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl font-headline font-extrabold text-slate-800 dark:text-white mb-2 leading-tight">
          Meal Logged Successfully
        </h1>
        
        {/* Detail message */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-[280px]">
          <span className="font-extrabold text-primary dark:text-primary-fixed-dim block text-base mb-1">
            {latestMeal.dish_name}
          </span>
          has been added to your calorie logs.
        </p>

        {/* Macro Summary Visualization */}
        <div className="w-full space-y-6">
          
          {/* Calorie Dial Visual */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Recessed Track */}
              <circle 
                className="text-slate-100 dark:text-slate-800 transition-colors" 
                cx="50" 
                cy="50" 
                fill="transparent" 
                r="40" 
                stroke="currentColor" 
                strokeWidth="10"
              />
              {/* Active Segment */}
              <motion.circle 
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * Math.min(latestMeal.total_calories / 2000, 1)) }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="text-primary dark:text-primary-fixed-dim" 
                cx="50" 
                cy="50" 
                fill="transparent" 
                r="40" 
                stroke="currentColor" 
                strokeDasharray="251.2" 
                strokeLinecap="round" 
                strokeWidth="10"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-800 dark:text-white">
                {fmt(latestMeal.total_calories)}
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400">
                kcal
              </span>
            </div>
          </div>

          {/* Macro Chips */}
          <div className="flex justify-between gap-3 px-1">
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-850 text-center shadow-inner">
              <span className="block font-bold text-[10px] text-indigo-500 mb-0.5">P</span>
              <span className="font-extrabold text-sm text-slate-700 dark:text-white">
                {fmt(latestMeal.total_macronutrients?.protein)}g
              </span>
            </div>
            
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-850 text-center shadow-inner">
              <span className="block font-bold text-[10px] text-amber-500 mb-0.5">C</span>
              <span className="font-extrabold text-sm text-slate-700 dark:text-white">
                {fmt(latestMeal.total_macronutrients?.carbohydrates)}g
              </span>
            </div>
            
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-850 text-center shadow-inner">
              <span className="block font-bold text-[10px] text-rose-500 mb-0.5">F</span>
              <span className="font-extrabold text-sm text-slate-700 dark:text-white">
                {fmt(latestMeal.total_macronutrients?.total_fat)}g
              </span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="w-full mt-8 space-y-3 font-body">
          <motion.button 
            whileHover={{ scale: 1.01, y: -0.5 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => router.push("/dashboard")}
            className="w-full h-12 btn-skeuo-primary rounded-xl text-white font-bold flex items-center justify-center gap-2 cursor-pointer focus:outline-none text-xs"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.01, y: -0.5 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => router.push("/calories")}
            className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl text-slate-700 dark:text-white font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors focus:outline-none text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Log Another Meal</span>
          </motion.button>
        </div>

      </motion.div>

      {/* Decorative Quick Stats Hint */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 0.7, y: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex flex-col sm:flex-row gap-4 px-2 select-none"
      >
        <div className="skeuo-card px-5 py-3 rounded-2xl flex items-center gap-3 border border-slate-200/30 dark:border-slate-850">
          <div className="w-8 h-8 rounded-full bg-primary/5 dark:bg-primary-container/10 flex items-center justify-center text-primary dark:text-primary-fixed shadow-inner">
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-left font-body">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Daily Balance</p>
            <p className="text-xs font-bold text-slate-700 dark:text-white">{fmt(todayCalories)} / 2,000 kcal</p>
          </div>
        </div>
        
        <div className="skeuo-card px-5 py-3 rounded-2xl flex items-center gap-3 border border-slate-200/30 dark:border-slate-850">
          <div className="w-8 h-8 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-500 shadow-inner">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-left font-body">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Streak</p>
            <p className="text-xs font-bold text-slate-700 dark:text-white">3 Days</p>
          </div>
        </div>
      </motion.div>

    </div>
  );
}

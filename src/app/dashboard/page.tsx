"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAuthStore } from "@/stores/authStore";
import { useMealStore } from "@/stores/mealStore";
import { MealHistoryTable } from "@/components/MealHistoryTable";
import { OnboardingTour } from "@/components/OnboardingTour";
import { 
  Loader2, 
  Sparkles, 
  TrendingUp, 
  Heart, 
  Plus, 
  ChevronRight,
  UtensilsCrossed,
  User,
  Mail,
  Calendar,
  ShieldCheck,
  HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalorieResult } from "@/types";

export default function DashboardPage() {
  const { isAuthorized } = useAuthGuard();
  const user = useAuthStore((state) => state.user);
  const setHasCompletedTour = useAuthStore((state) => state.setHasCompletedTour);
  const { history, setResult } = useMealStore();
  const router = useRouter();

  if (!isAuthorized || !user) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // 1. Calculate dynamic statistics from search history
  const totalMeals = history.length;
  
  const avgCalories = totalMeals > 0 
    ? Math.round(history.reduce((sum, item) => sum + item.total_calories, 0) / totalMeals)
    : 0;

  const getFavoriteDish = () => {
    if (totalMeals === 0) return "None";
    const freqs: Record<string, number> = {};
    history.forEach((item) => {
      freqs[item.dish_name] = (freqs[item.dish_name] || 0) + 1;
    });
    let max = 0;
    let fav = "None";
    Object.entries(freqs).forEach(([name, count]) => {
      if (count > max) {
        max = count;
        fav = name;
      }
    });
    return fav;
  };
  const favoriteDish = getFavoriteDish();

  // 2. Calculate daily calories logged today
  const todayStr = new Date().toDateString();
  const todayMeals = history.filter((item) => {
    if (!item.timestamp) return false;
    return new Date(item.timestamp).toDateString() === todayStr;
  });
  const todayCalories = todayMeals.reduce((sum, item) => sum + item.total_calories, 0);
  const caloriePercent = Math.min(Math.round((todayCalories / 2000) * 100), 100);

  // 3. Recommended meal simulation
  const handleAddRecommended = () => {
    const mockSalad: CalorieResult = {
      dish_name: "Chickpea & Feta Mediterranean Salad",
      servings: 1,
      data_source: "USDA FoodData Central",
      calories_per_serving: 320,
      total_calories: 320,
      macronutrients_per_serving: {
        protein: 12,
        total_fat: 14,
        carbohydrates: 36,
        fiber: 6,
        sugars: 4
      },
      total_macronutrients: {
        protein: 12,
        total_fat: 14,
        carbohydrates: 36,
        fiber: 6,
        sugars: 4
      },
      ingredient_breakdown: [
        { name: "Chickpeas", calories_per_100g: 164, serving_size: 150, data_type: "SR Legacy", fdc_id: 173756, macronutrients_per_100g: { protein: 8.86, total_fat: 2.59, carbohydrates: 27.42 } },
        { name: "Feta Cheese", calories_per_100g: 264, serving_size: 30, data_type: "SR Legacy", fdc_id: 172185, macronutrients_per_100g: { protein: 14.21, total_fat: 21.28, carbohydrates: 4.09 } }
      ],
      matched_food: {
        name: "Chickpea salad with feta cheese",
        fdc_id: 173756,
        data_type: "SR Legacy",
        published_date: "2019-04-01"
      }
    };
    setResult(mockSalad);
    alert("Mediterranean Salad has been added to your log!");
  };

  // 4. Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  const greeting = getGreeting();
  const fullName = `${user.first_name} ${user.last_name}`;

  const handleRestartTour = () => {
    setHasCompletedTour(false);
  };

  return (
    <div className="space-y-6 py-4 font-body">
      <OnboardingTour />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column (60%) */}
        <div className="md:col-span-7 flex flex-col gap-6">
          
          {/* Welcome Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="skeuo-card p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-br from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900 border border-slate-200/20 dark:border-slate-800/30"
          >
            <div className="flex-1 space-y-4 text-center sm:text-left">
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tight text-slate-800 dark:text-white">
                  {greeting}, {user.first_name}
                </h2>
                <p className="text-sm text-slate-605 dark:text-slate-400 leading-relaxed">
                  Your health journey is looking great today. You've logged {caloriePercent}% of your target calories.
                </p>
              </div>
              <Link href="/calories" passHref legacyBehavior>
                <motion.a 
                  id="calories-lookup-link"
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.98, y: 1 }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-bold skeuo-button border-none cursor-pointer text-xs"
                >
                  <span>Go to Calorie Lookup</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.a>
              </Link>
            </div>
            
            {/* Visual Abstract Circle Decoration */}
            <div className="w-32 h-32 flex items-center justify-center relative select-none">
              <div className="absolute inset-0 bg-primary-container/10 dark:bg-primary-container/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 flex items-center justify-center shadow-inner relative z-10">
                <Sparkles className="w-10 h-10 text-amber-500 animate-bounce" />
              </div>
            </div>
          </motion.div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Metric 1 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.05 }}
              className="skeuo-pill p-5 flex flex-col items-center text-center border border-slate-200/20 dark:border-slate-800/30"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center mb-2.5 text-emerald-650 dark:text-emerald-450 shadow-inner">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-slate-800 dark:text-white">{totalMeals}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-extrabold tracking-wider mt-0.5">Meals Logged</span>
            </motion.div>

            {/* Metric 2 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
              className="skeuo-pill p-5 flex flex-col items-center text-center border border-slate-200/20 dark:border-slate-800/30"
            >
              <div className="w-10 h-10 rounded-full bg-primary-light/40 dark:bg-primary-container/20 border border-primary-light dark:border-primary-dark flex items-center justify-center mb-2.5 text-primary shadow-inner">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-slate-800 dark:text-white">{avgCalories} <span className="text-xs font-semibold text-slate-500">kcal</span></span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-extrabold tracking-wider mt-0.5">Avg Calories</span>
            </motion.div>

            {/* Metric 3 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.15 }}
              className="skeuo-pill p-5 flex flex-col items-center text-center border border-slate-200/20 dark:border-slate-800/30 overflow-hidden"
            >
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 flex items-center justify-center mb-2.5 text-amber-600 dark:text-amber-500 shadow-inner">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-base font-extrabold text-slate-800 dark:text-white truncate max-w-full px-1.5 leading-tight">{favoriteDish}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-extrabold tracking-wider mt-0.5">Most Frequent</span>
            </motion.div>

          </div>

          {/* Recommended Insights Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="skeuo-card p-5 border border-slate-200/20 dark:border-slate-800/30"
          >
            <div className="flex flex-col sm:flex-row items-center gap-5">
              
              {/* Dish Visual Avatar Representation */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shrink-0 flex items-center justify-center select-none text-slate-400 dark:text-slate-600">
                <UtensilsCrossed className="w-8 h-8 text-primary/40" />
              </div>
              
              <div className="flex-1 text-center sm:text-left space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250/20 text-emerald-600 dark:text-emerald-450 font-bold text-[9px] uppercase tracking-wider">
                  Recommended Insight
                </span>
                <h3 className="text-base font-headline font-bold text-slate-800 dark:text-white">
                  Chickpea & Feta Mediterranean Salad
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  High protein • 320 kcal • 15 min preparation
                </p>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddRecommended}
                className="w-10 h-10 rounded-xl bg-white dark:bg-surface-dark border-t border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-200 shadow-tactile-raised dark:shadow-tactile-dark-raised flex items-center justify-center hover:text-primary transition-colors cursor-pointer"
                title="Add recommended meal to logs"
              >
                <Plus className="w-5 h-5" />
              </motion.button>

            </div>
          </motion.div>

        </div>

        {/* Right Column (40%) */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <MealHistoryTable />

          {/* User Profile / Tour Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.25 }}
            className="skeuo-card p-5 border border-slate-200/20 dark:border-slate-800/30"
          >
            <div className="flex items-center gap-2 mb-3.5 border-b border-slate-100 dark:border-slate-850 pb-2">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-headline font-bold text-slate-800 dark:text-white">
                Member Profile
              </h3>
            </div>
            
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl text-slate-500 shadow-inner">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Name</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5">{fullName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl text-slate-500 shadow-inner">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Email</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 break-all mt-0.5">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-850">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRestartTour}
                className="w-full py-2 px-3 rounded-xl border border-primary/20 hover:bg-primary/5 text-primary text-xs font-bold font-body transition-colors cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none"
              >
                <HelpCircle className="w-4 h-4 animate-pulse" />
                <span>Replay Guided Tour</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

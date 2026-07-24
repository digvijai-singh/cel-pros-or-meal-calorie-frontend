"use client";

import { useState, useEffect } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useMealStore } from "@/stores/mealStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  Utensils, 
  LineChart, 
  Settings, 
  Plus, 
  HelpCircle, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sun,
  Coffee,
  Moon,
  Activity,
  Droplet,
  PlusCircle,
  Share2,
  Trash2,
  Dumbbell,
  Wheat,
  Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MealLogPage() {
  const { isAuthorized } = useAuthGuard();
  const { history, waterIntake, addWater, clearHistory } = useMealStore();
  const { logout } = useAuthStore();
  const router = useRouter();

  // Date selection state (defaults to today)
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isAuthorized || !mounted) return null;

  // Generate 5 days centered around selectedDate
  const getDaysRange = (centerDate: Date) => {
    const range = [];
    for (let i = -2; i <= 2; i++) {
      const d = new Date(centerDate);
      d.setDate(centerDate.getDate() + i);
      range.push(d);
    }
    return range;
  };

  const daysRange = getDaysRange(selectedDate);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(selectedDate.getDate() - 1);
    setSelectedDate(d);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(selectedDate.getDate() + 1);
    setSelectedDate(d);
  };

  // Filter history meals logged on selected date
  const selectedDateStr = selectedDate.toDateString();
  const mealsForDate = history.filter((item) => {
    if (!item.timestamp) return false;
    return new Date(item.timestamp).toDateString() === selectedDateStr;
  });

  // Categorize meals by category
  // In the multi-item flow, we set category as Breakfast, Lunch, Dinner, Snack
  const getCategoryMeals = (catName: string) => {
    return mealsForDate.filter(item => {
      if (!item.category) {
        // Fallback heuristics based on hour of timestamp if category is undefined
        if (!item.timestamp) return false;
        const hr = new Date(item.timestamp).getHours();
        if (catName === "Breakfast" && hr >= 5 && hr < 11) return true;
        if (catName === "Lunch" && hr >= 11 && hr < 16) return true;
        if (catName === "Dinner" && hr >= 16 && hr < 23) return true;
        if (catName === "Snack" && (hr >= 23 || hr < 5)) return true;
        return false;
      }
      return item.category.toLowerCase() === catName.toLowerCase();
    });
  };

  const categoriesConfig = [
    { name: "Breakfast", icon: Sun, color: "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400" },
    { name: "Lunch", icon: Utensils, color: "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400" },
    { name: "Dinner", icon: Moon, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400" },
    { name: "Snack", icon: Activity, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" }
  ];

  // Daily target budgets
  const dailyTargetCalories = 2100;
  const targetProtein = 130;
  const targetCarbs = 210;
  const targetFat = 70;

  // Calculate day totals
  const totalCalories = mealsForDate.reduce((sum, item) => sum + item.total_calories, 0);
  const totalProtein = mealsForDate.reduce((sum, item) => sum + (item.total_macronutrients?.protein || 0), 0);
  const totalCarbs = mealsForDate.reduce((sum, item) => sum + (item.total_macronutrients?.carbohydrates || 0), 0);
  const totalFat = mealsForDate.reduce((sum, item) => sum + (item.total_macronutrients?.total_fat || 0), 0);

  const caloriePercent = Math.min((totalCalories / dailyTargetCalories) * 100, 100);
  const proteinPercent = Math.min((totalProtein / targetProtein) * 100, 100);
  const carbsPercent = Math.min((totalCarbs / targetCarbs) * 100, 100);
  const fatPercent = Math.min((totalFat / targetFat) * 100, 100);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const fmt = (val: number) => Number(val).toFixed(0);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 min-h-[calc(100vh-64px)] flex font-body bg-[#f8f9fb] dark:bg-[#020617] text-slate-850 dark:text-white select-none">
      
      {/* Sidebar (Desktop Only) */}
      <aside className="w-64 border-r border-slate-200/60 dark:border-slate-800 bg-[#f3f4f6] dark:bg-[#0b1120] p-6 flex flex-col justify-between shrink-0 hidden lg:flex">
        <div className="space-y-6">
          <div>
            <h2 className="font-headline text-lg font-black text-primary dark:text-primary-fixed leading-tight">
              Meal Calorie Studio
            </h2>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5 font-sans">
              Tactile Health Tracking
            </p>
          </div>
          
          <nav className="space-y-1.5 pt-4">
            <button 
              onClick={() => router.push("/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/55 dark:hover:bg-slate-800 rounded-2xl font-bold text-xs transition-all cursor-pointer focus:outline-none text-left"
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>Dashboard</span>
            </button>
            
            <button 
              onClick={() => router.push("/calories")}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/55 dark:hover:bg-slate-800 rounded-2xl font-bold text-xs transition-all cursor-pointer focus:outline-none text-left"
            >
              <Search className="w-4.5 h-4.5" />
              <span>Calorie Lookup</span>
            </button>
            
            <button 
              onClick={() => router.push("/meals")}
              className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-2xl font-extrabold text-xs shadow-md transition-all cursor-pointer focus:outline-none"
            >
              <Utensils className="w-4.5 h-4.5" />
              <span>Meal Log</span>
            </button>
            
            <button 
              onClick={() => router.push("/nutrition")}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/55 dark:hover:bg-slate-800 rounded-2xl font-bold text-xs transition-all cursor-pointer focus:outline-none text-left"
            >
              <LineChart className="w-4.5 h-4.5" />
              <span>Nutrition</span>
            </button>
            
            <button 
              onClick={() => router.push("/settings")}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/55 dark:hover:bg-slate-800 rounded-2xl font-bold text-xs transition-all cursor-pointer focus:outline-none text-left"
            >
              <Settings className="w-4.5 h-4.5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => router.push("/calories")}
            className="w-full h-12 btn-skeuo-primary rounded-xl text-white font-bold flex items-center justify-center gap-2 cursor-pointer focus:outline-none text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Meal</span>
          </button>
          
          <div className="space-y-1">
            <button 
              className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/55 dark:hover:bg-slate-800 rounded-xl font-bold text-xs cursor-pointer focus:outline-none text-left"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Support</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl font-bold text-xs cursor-pointer focus:outline-none text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 p-6 md:p-8 space-y-8 bg-[#f8f9fb] dark:bg-[#020617] relative max-w-5xl mx-auto">
        
        {/* Page title and Date navigator strip */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-200/50 dark:border-slate-850 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-headline font-black tracking-tight text-slate-805 dark:text-white">
              Meal Log History
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Keep track of your journey, one bite at a time.
            </p>
          </div>

          {/* Date navigator strip */}
          <div className="skeuo-card bg-white dark:bg-slate-900 p-1.5 flex items-center gap-1 border border-slate-200/30 dark:border-slate-850 rounded-2xl shadow-sm self-start md:self-auto overflow-hidden">
            <button 
              onClick={handlePrevDay}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-55 dark:hover:bg-slate-800 text-slate-550 dark:text-slate-400 transition-colors focus:outline-none cursor-pointer"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>

            <div className="flex gap-1.5 px-1">
              {daysRange.map((d, index) => {
                const isSelected = d.toDateString() === selectedDateStr;
                const dateNum = d.getDate();
                const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" }).substring(0, 3);
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(d)}
                    className={`flex flex-col items-center justify-center min-w-[50px] h-14 rounded-xl transition-all cursor-pointer focus:outline-none ${
                      isSelected 
                        ? "bg-primary text-white shadow-md font-extrabold"
                        : "text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850"
                    }`}
                  >
                    <span className="text-[8px] uppercase tracking-wider font-extrabold leading-none mb-1">
                      {dayLabel}
                    </span>
                    <span className="text-sm leading-none font-bold">
                      {dateNum}
                    </span>
                  </button>
                );
              })}
            </div>

            <button 
              onClick={handleNextDay}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-55 dark:hover:bg-slate-800 text-slate-550 dark:text-slate-400 transition-colors focus:outline-none cursor-pointer"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>

            <button 
              onClick={() => setSelectedDate(new Date())}
              className="p-2 text-primary dark:text-primary-fixed-dim hover:bg-slate-55 dark:hover:bg-slate-850 rounded-xl flex items-center justify-center focus:outline-none cursor-pointer ml-1"
              title="Today"
            >
              <Calendar className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {mealsForDate.length === 0 ? (
          <div className="flex justify-center items-center py-10 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[32px] p-8 text-center border border-slate-200/20 dark:border-slate-800/30 shadow-lg soft-skeuo z-10"
            >
              {/* Soft 3D Illustration Placeholder */}
              <div className="relative w-40 h-40 mx-auto mb-6 group">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500" />
                <div className="w-full h-full relative z-10 flex items-center justify-center">
                  <div className="w-36 h-36 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden border border-white/50 dark:border-slate-800/30">
                    <img 
                      alt="Empty recipe book" 
                      className="object-contain p-4 drop-shadow-xl" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfTBo7z4PW91nynwTyRiFPYO3SeYyr7yji3S6FB6rsCowfZQYW8_CTHD7_cGJ99aBquiMHkgvDlz146uVG81xG8wQ22cVhfXftU2XwXU05kOV8fwb4W6eWWjcMNdADSnAngYqQXXr8llnI5Mh0oI897zE2U5CJAcm7_vO6cdVmW_RxORW2TWI8oCAf6YrkX6w4_HMN3QZeOR6xVgHjATBKVLpxdmmRHugTZ8f_sjHEK27gz6O6auPM35cGJVWTX61br2UtUQdHGFE" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-8">
                <h2 className="font-headline font-black text-xl text-slate-805 dark:text-white">Your log is empty</h2>
                <p className="font-body text-xs text-slate-500 dark:text-slate-400 px-4 leading-relaxed">
                  Ready to add your first meal? Tracking helps you reach your goals faster.
                </p>
              </div>
              
              <div className="flex flex-col gap-4">
                {/* Primary CTA */}
                <button 
                  onClick={() => router.push("/calories")}
                  className="w-full h-[48px] bg-gradient-to-b from-primary to-primary-container text-white font-bold rounded-2xl shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer focus:outline-none"
                >
                  <PlusCircle className="w-4 h-4 fill-current" />
                  <span>Lookup a Meal</span>
                </button>
              </div>
              
              {/* Small Tip Section */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-center gap-1.5 text-slate-400 dark:text-slate-500">
                <Lightbulb className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Pro Tip: Try scanning a barcode!</span>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Multi-Pane Grid */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
          
          {/* Left Column (Col-span-7): Meal list */}
          <div className="md:col-span-7 space-y-6">
            
            {categoriesConfig.map((cat) => {
              const Icon = cat.icon;
              const catMeals = getCategoryMeals(cat.name);
              
              if (catMeals.length > 0) {
                // Compile values for display
                const catCalories = catMeals.reduce((sum, item) => sum + item.total_calories, 0);
                const catProtein = catMeals.reduce((sum, item) => sum + (item.total_macronutrients?.protein || 0), 0);
                const catCarbs = catMeals.reduce((sum, item) => sum + (item.total_macronutrients?.carbohydrates || 0), 0);
                const catFat = catMeals.reduce((sum, item) => sum + (item.total_macronutrients?.total_fat || 0), 0);
                const foodNames = catMeals.map(item => item.dish_name).join(", ");
                const timeLabel = new Date(catMeals[0].timestamp || "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <motion.div
                    layout
                    key={cat.name}
                    className="skeuo-card bg-white dark:bg-slate-900 rounded-[20px] p-5 flex items-start gap-4 border border-slate-200/20 dark:border-slate-800/30"
                  >
                    {/* Circle icon */}
                    <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center shadow-inner shrink-0`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    {/* Meal details text */}
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-headline font-black text-slate-800 dark:text-white text-base">
                            {cat.name}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            {timeLabel}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-headline font-black text-lg text-primary dark:text-primary-fixed-dim">
                            {fmt(catCalories)}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block leading-none">
                            kcal
                          </span>
                        </div>
                      </div>

                      {/* Recessed items summary */}
                      <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850/50 shadow-inner mb-4">
                        <p className="text-xs text-slate-655 dark:text-slate-300 font-medium leading-relaxed">
                          {foodNames}
                        </p>
                      </div>

                      {/* Macro indicator chips */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-slate-50 dark:bg-slate-950 text-slate-550 dark:text-slate-400 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 border border-slate-150 dark:border-slate-850 macro-glow-protein">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{fmt(catProtein)}g Protein</span>
                        </span>
                        
                        <span className="px-3 py-1 bg-slate-50 dark:bg-slate-950 text-slate-550 dark:text-slate-400 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 border border-slate-150 dark:border-slate-850 macro-glow-carbs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{fmt(catCarbs)}g Carbs</span>
                        </span>
                        
                        <span className="px-3 py-1 bg-slate-50 dark:bg-slate-950 text-slate-550 dark:text-slate-400 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 border border-slate-150 dark:border-slate-850 macro-glow-fat">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>{fmt(catFat)}g Fat</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              // Empty Category State (Dotted CTA Button)
              return (
                <button
                  key={cat.name}
                  onClick={() => router.push(`/calories?category=${cat.name}`)}
                  className="w-full skeuo-card bg-transparent shadow-none border-2 border-dashed border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center gap-2 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer focus:outline-none group rounded-[20px]"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-600 group-hover:scale-105 transition-all shadow-inner">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-slate-450 dark:text-slate-505 group-hover:text-primary transition-colors">
                    Add {cat.name.toLowerCase()} meal
                  </span>
                </button>
              );
            })}

          </div>

          {/* Right Column (Col-span-5): Progress Summary and Hydration details */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Daily Summary statistics */}
            <div className="skeuo-card p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200/20 dark:border-slate-800/30 rounded-[20px] shadow-md">
              <h3 className="font-headline font-black text-base text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-primary" />
                <span>Today's Summary</span>
              </h3>

              <div className="space-y-8 font-body">
                {/* Calories progress */}
                <div>
                  <div className="flex justify-between items-end mb-2.5">
                    <div>
                      <span className="text-2xl font-black text-primary dark:text-primary-fixed-dim">
                        {fmt(totalCalories)}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {" "} / {dailyTargetCalories} kcal
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-650 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-100/10">
                      {fmt(caloriePercent)}% Goal
                    </span>
                  </div>
                  
                  <div className="progress-channel h-2.5 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${caloriePercent}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(26,115,232,0.4)]"
                    />
                  </div>
                  
                  <p className="mt-3 text-xs text-slate-400 italic">
                    {totalCalories >= dailyTargetCalories 
                      ? "Daily calorie budget achieved!" 
                      : `You have ${fmt(dailyTargetCalories - totalCalories)} kcal left for today.`}
                  </p>
                </div>

                {/* Macro summary capsules */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-850">
                  {/* Protein */}
                  <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850 flex justify-between items-center shadow-inner">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-primary">
                        <Dumbbell className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs text-slate-700 dark:text-white">Protein</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-slate-805 dark:text-slate-200">
                        {fmt(totalProtein)}g / {targetProtein}g
                      </div>
                      <div className="w-20 progress-channel h-1 mt-1 bg-slate-200 dark:bg-slate-900">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${proteinPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Carbs */}
                  <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850 flex justify-between items-center shadow-inner">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-500">
                        <Wheat className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs text-slate-700 dark:text-white">Carbs</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-slate-805 dark:text-slate-200">
                        {fmt(totalCarbs)}g / {targetCarbs}g
                      </div>
                      <div className="w-20 progress-channel h-1 mt-1 bg-slate-200 dark:bg-slate-900">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${carbsPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fat */}
                  <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850 flex justify-between items-center shadow-inner">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 dark:text-amber-500">
                        <Droplet className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs text-slate-700 dark:text-white">Fat</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-slate-805 dark:text-slate-200">
                        {fmt(totalFat)}g / {targetFat}g
                      </div>
                      <div className="w-20 progress-channel h-1 mt-1 bg-slate-200 dark:bg-slate-900">
                        <div 
                          className="h-full bg-amber-500 rounded-full" 
                          style={{ width: `${fatPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Share progress button */}
                <button className="w-full py-3 rounded-xl border border-primary dark:border-primary-fixed-dim text-primary dark:text-primary-fixed-dim hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-bold text-xs cursor-pointer focus:outline-none mt-4">
                  <Share2 className="w-4 h-4" />
                  <span>Share Progress</span>
                </button>
              </div>
            </div>

            {/* Hydration Tracker Card */}
            <div className="skeuo-card p-5 bg-white dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800/30 rounded-[20px] flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-500 shadow-inner">
                  <Droplet className="w-5.5 h-5.5 fill-current" />
                </div>
                <div>
                  <h4 className="font-headline font-black text-sm text-slate-800 dark:text-white">
                    Water Intake
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {waterIntake || 0} / 8 glasses today
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addWater}
                  className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer focus:outline-none shadow-sm"
                >
                  <Plus className="w-4 h-4 text-primary dark:text-primary-fixed-dim" />
                </motion.button>
              </div>
            </div>

          </div>

        </div>
        )}

      </main>

    </div>
  );
}

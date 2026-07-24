"use client";

import { useState, useEffect } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAuthStore } from "@/stores/authStore";
import { useMealStore } from "@/stores/mealStore";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  LayoutDashboard, 
  Search, 
  Utensils, 
  LineChart, 
  Settings, 
  Plus, 
  HelpCircle, 
  LogOut,
  User,
  Sliders,
  Sparkles,
  Save,
  Bell,
  Heart,
  Smartphone,
  ChevronRight,
  Sun,
  Moon,
  Tv,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const { isAuthorized } = useAuthGuard();
  const { user, logout, updateUser } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Local state for profile inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Goals
  const [calorieTarget, setCalorieTarget] = useState(2450);
  const [proteinRatio, setProteinRatio] = useState(30);
  const [carbsRatio, setCarbsRatio] = useState(50);
  const [fatRatio, setFatRatio] = useState(20);

  // Notification states
  const [mealReminders, setMealReminders] = useState(true);
  const [weeklyInsights, setWeeklyInsights] = useState(true);
  const [communityAlerts, setCommunityAlerts] = useState(false);

  // Integrations
  const [appleHealthConnected, setAppleHealthConnected] = useState(true);
  const [fitbitConnected, setFitbitConnected] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  if (!isAuthorized || !mounted || !user) return null;

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API update
    setTimeout(() => {
      updateUser({
        first_name: firstName,
        last_name: lastName,
        email: email
      });
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Adjust calorie slider click helper
  const handleCalorieClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    // Calorie range from 1200 to 4000
    const val = Math.round(1200 + percentage * (4000 - 1200));
    setCalorieTarget(Math.round(val / 50) * 50); // Snap to 50
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 min-h-[calc(100vh-64px)] flex font-body bg-[#f8f9fb] dark:bg-[#020617] text-slate-855 dark:text-white select-none">
      
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
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/55 dark:hover:bg-slate-800 rounded-2xl font-bold text-xs transition-all cursor-pointer focus:outline-none text-left"
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
              className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-2xl font-extrabold text-xs shadow-md transition-all cursor-pointer focus:outline-none"
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
      <main className="flex-1 p-6 md:p-8 space-y-8 bg-[#f8f9fb] dark:bg-[#020617] relative max-w-5xl mx-auto overflow-hidden">
        
        {/* Page Header */}
        <div className="border-b border-slate-200/50 dark:border-slate-850 pb-5">
          <h1 className="text-2xl font-headline font-black tracking-tight text-slate-805 dark:text-white">
            Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Personalize your nutritional experience and goals.
          </p>
        </div>

        {/* Multi-Pane Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
          
          {/* Left Column (Col-span-7): Profile & Goals */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Profile settings */}
            <section className="skeuo-card bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-200/20 dark:border-slate-800/30 space-y-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-headline font-black text-slate-800 dark:text-white text-base">
                  Profile Details
                </h3>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="relative group cursor-pointer shrink-0">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-md">
                    <img 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT4SN_5QUKVQ8rp48KpcKDaZEWIrFuud7IqpEGXHFoaWpryHFz_6v-uHIQooEuUmhSA69834YgSD36nCPfr2BDwcWX5N1bWdUp6CbIV59SQNaSX4mgUQ56sT-q5czYvjz_IWuMY60z_YRUflnrRQk2hDLaWshoikLglrUb9xV10WLjO8izj6K06hdzSejpR8aTIM4Q368a4Up-3UrjbT-7nvnAVFR4a7lHOMLItCaVndLs_RkvV27HcagKEUJrlAxbUJF2m5vlUMc" 
                      alt="Avatar"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-lg shadow-md border border-white/20">
                    <span className="material-symbols-outlined text-[12px]">edit</span>
                  </div>
                </div>

                <div className="flex-grow w-full space-y-4 font-body">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                        First Name
                      </label>
                      <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 px-4 py-2.5 rounded-xl font-bold text-xs w-full focus:ring-0 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                        Last Name
                      </label>
                      <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 px-4 py-2.5 rounded-xl font-bold text-xs w-full focus:ring-0 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 px-4 py-2.5 rounded-xl font-bold text-xs w-full focus:ring-0 outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Health goals */}
            <section className="skeuo-card bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-200/20 dark:border-slate-800/30 space-y-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                <Sliders className="w-5 h-5 text-primary" />
                <h3 className="font-headline font-black text-slate-800 dark:text-white text-base">
                  Health Goals
                </h3>
              </div>

              <div className="space-y-6 font-body">
                {/* Calories slider target */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-405 uppercase tracking-wide">Daily Calorie Target</label>
                    <span className="text-lg font-black text-primary">
                      {calorieTarget.toLocaleString()}{" "}
                      <span className="text-[10px] font-bold text-slate-400">kcal</span>
                    </span>
                  </div>
                  <div 
                    onClick={handleCalorieClick}
                    className="macro-channel bg-slate-100 dark:bg-slate-950 h-3 w-full rounded-full relative overflow-hidden shadow-inner cursor-pointer"
                  >
                    <div 
                      className="h-full bg-primary/20" 
                      style={{ width: `${((calorieTarget - 1200) / (4000 - 1200)) * 100}%` }}
                    />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-5.5 h-5.5 bg-white border-2 border-primary rounded-full shadow-lg"
                      style={{ left: `calc(${((calorieTarget - 1200) / (4000 - 1200)) * 100}% - 11px)` }}
                    />
                  </div>
                </div>

                {/* Macro Ratios progress sliders */}
                <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-850">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                    Target Macro Ratio
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Protein */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-3 shadow-inner">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-blue-700 dark:text-blue-400">Protein</span>
                        <span className="text-slate-805 dark:text-white">30%</span>
                      </div>
                      <div className="macro-channel bg-slate-200 dark:bg-slate-900">
                        <div className="macro-glow bg-blue-500 w-[30%]" />
                      </div>
                    </div>

                    {/* Carbs */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-3 shadow-inner">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-emerald-700 dark:text-emerald-505">Carbs</span>
                        <span className="text-slate-805 dark:text-white">50%</span>
                      </div>
                      <div className="macro-channel bg-slate-200 dark:bg-slate-900">
                        <div className="macro-glow bg-emerald-500 w-[50%]" />
                      </div>
                    </div>

                    {/* Fats */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-3 shadow-inner">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-amber-700 dark:text-amber-500">Fat</span>
                        <span className="text-slate-805 dark:text-white">20%</span>
                      </div>
                      <div className="macro-channel bg-slate-200 dark:bg-slate-900">
                        <div className="macro-glow bg-amber-500 w-[20%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column (Col-span-5): Preferences & Integration */}
          <div className="md:col-span-5 space-y-6">
            
            {/* App Preferences */}
            <section className="skeuo-card bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-200/20 dark:border-slate-800/30 space-y-6 shadow-sm font-body">
              <div className="flex items-center gap-3 mb-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="font-headline font-black text-slate-800 dark:text-white text-base">
                  App Preferences
                </h3>
              </div>

              {/* Theme Settings Mode Selector */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Theme Mode
                </label>
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-850 shadow-inner">
                  <button 
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer focus:outline-none ${
                      theme === "light" 
                        ? "bg-white dark:bg-slate-800 text-primary shadow-sm border border-slate-150/10" 
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                    }`}
                  >
                    <Sun className="w-4.5 h-4.5" />
                    <span>Light</span>
                  </button>
                  <button 
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer focus:outline-none ${
                      theme === "dark" 
                        ? "bg-white dark:bg-slate-800 text-primary shadow-sm border border-slate-150/10" 
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                    }`}
                  >
                    <Moon className="w-4.5 h-4.5" />
                    <span>Dark</span>
                  </button>
                  <button 
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer focus:outline-none ${
                      theme === "system" 
                        ? "bg-white dark:bg-slate-800 text-primary shadow-sm border border-slate-150/10" 
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                    }`}
                  >
                    <Tv className="w-4.5 h-4.5" />
                    <span>System</span>
                  </button>
                </div>
              </div>

              {/* Notification active switches */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                  Notifications
                </label>

                {/* Reminders */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-extrabold text-xs text-slate-800 dark:text-white">Meal Reminders</span>
                    <span className="text-[10px] text-slate-405 mt-0.5">Notify when it's time to log a meal</span>
                  </div>
                  <button 
                    onClick={() => setMealReminders(!mealReminders)}
                    className={`toggle-switch ${mealReminders ? "active" : ""} focus:outline-none`}
                  >
                    <div className="toggle-knob" />
                  </button>
                </div>

                {/* Insights */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-extrabold text-xs text-slate-800 dark:text-white">Weekly Insights</span>
                    <span className="text-[10px] text-slate-405 mt-0.5">Summary of your nutritional trends</span>
                  </div>
                  <button 
                    onClick={() => setWeeklyInsights(!weeklyInsights)}
                    className={`toggle-switch ${weeklyInsights ? "active" : ""} focus:outline-none`}
                  >
                    <div className="toggle-knob" />
                  </button>
                </div>

                {/* Community alerts */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-extrabold text-xs text-slate-800 dark:text-white">Community Alerts</span>
                    <span className="text-[10px] text-slate-405 mt-0.5">Updates from your healthy groups</span>
                  </div>
                  <button 
                    onClick={() => setCommunityAlerts(!communityAlerts)}
                    className={`toggle-switch ${communityAlerts ? "active" : ""} focus:outline-none`}
                  >
                    <div className="toggle-knob" />
                  </button>
                </div>
              </div>
            </section>

            {/* Health integration */}
            <section className="skeuo-card bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-200/20 dark:border-slate-800/30 space-y-4 shadow-sm font-body">
              <div className="flex items-center gap-3 mb-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                <Heart className="w-5 h-5 text-primary" />
                <h3 className="font-headline font-black text-slate-800 dark:text-white text-base">
                  Integrations
                </h3>
              </div>

              {/* Apple Health */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-850 shadow-inner">
                <div className="w-9 h-9 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center text-rose-500 shadow-sm border border-slate-200/30 dark:border-slate-800 shrink-0">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div className="flex-grow min-w-0">
                  <span className="font-bold block text-xs truncate">Apple Health</span>
                  <span className="text-[9px] text-emerald-650 dark:text-emerald-500 font-extrabold">Connected</span>
                </div>
                <button 
                  onClick={() => setAppleHealthConnected(!appleHealthConnected)}
                  className="text-primary hover:text-primary-dark font-extrabold text-xs focus:outline-none cursor-pointer"
                >
                  {appleHealthConnected ? "Disconnect" : "Connect"}
                </button>
              </div>

              {/* Fitbit */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-850 shadow-inner">
                <div className="w-9 h-9 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center text-blue-400 shadow-sm border border-slate-200/30 dark:border-slate-800 shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="flex-grow min-w-0">
                  <span className="font-bold block text-xs truncate">Fitbit Devices</span>
                  <span className={`text-[9px] font-extrabold ${fitbitConnected ? "text-emerald-655" : "text-slate-400"}`}>
                    {fitbitConnected ? "Connected" : "Not Connected"}
                  </span>
                </div>
                <button 
                  onClick={() => setFitbitConnected(!fitbitConnected)}
                  className="text-primary hover:text-primary-dark font-extrabold text-xs focus:outline-none cursor-pointer"
                >
                  {fitbitConnected ? "Disconnect" : "Connect"}
                </button>
              </div>
            </section>

            {/* Save Profile Button */}
            <div className="pt-2">
              <motion.button 
                whileHover={{ scale: 1.01, y: -0.5 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSave}
                disabled={isSaving}
                className="btn-skeuo-primary w-full h-[52px] rounded-2xl font-headline font-black text-xs flex items-center justify-center gap-2 cursor-pointer focus:outline-none shadow-lg text-white"
              >
                {isSaving ? (
                  <span className="animate-pulse">Saving Changes...</span>
                ) : (
                  <>
                    <Save className="w-4.5 h-4.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </motion.button>
            </div>

          </div>

        </div>

      </main>

      {/* Floating Success Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 font-headline text-xs font-bold border border-emerald-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

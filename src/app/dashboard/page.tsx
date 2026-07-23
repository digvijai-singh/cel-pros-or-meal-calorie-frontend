"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAuthStore } from "@/stores/authStore";
import { MealHistoryTable } from "@/components/MealHistoryTable";
import { Loader2, User, Mail, Calendar, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { isAuthorized } = useAuthGuard();
  const user = useAuthStore((state) => state.user);

  if (!isAuthorized || !user) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <div className="space-y-6 py-4 font-body">
      {/* Welcome banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-gradient-to-br from-indigo-650 via-primary-container to-primary text-white rounded-2xl p-6 md:p-8 shadow-tactile-raised relative overflow-hidden border border-white/10"
      >
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-6 translate-y-6">
          <Sparkles className="w-56 h-56" />
        </div>
        <h2 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tight">
          Welcome back, {user.first_name}!
        </h2>
        <p className="text-blue-100 mt-2 max-w-lg text-xs md:text-sm leading-relaxed">
          Track and analyze the calorie counts and macronutrients of all your dishes using real-time USDA datasets.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User profile info card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.05 }}
          className="skeuo-card p-6 border border-slate-200/20 dark:border-slate-800/30 h-fit"
        >
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-850 pb-2">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white font-headline">
              Profile Details
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl text-slate-500 shadow-inner">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Full Name</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">{fullName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl text-slate-500 shadow-inner">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Email Address</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white break-all mt-0.5">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl text-slate-500 shadow-inner">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Account ID</p>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">{user.id}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent searches history log */}
        <div className="lg:col-span-2">
          <MealHistoryTable />
        </div>
      </div>
    </div>
  );
}

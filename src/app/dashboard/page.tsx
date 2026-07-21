"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAuthStore } from "@/stores/authStore";
import { MealHistoryTable } from "@/components/MealHistoryTable";
import { Loader2, User, Mail, Calendar, Sparkles } from "lucide-react";

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
    <div className="space-y-8 py-4">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
          <Sparkles className="w-48 h-48" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Welcome back, {user.first_name}!
        </h2>
        <p className="text-amber-100 mt-2 max-w-md text-sm md:text-base">
          Track and analyze the calorie counts and macronutrients of all your dishes using real-time USDA datasets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User profile info card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md h-fit">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-850 pb-2">
            Profile Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-105 dark:bg-slate-800 rounded-lg text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Full Name</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-105 dark:bg-slate-800 rounded-lg text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Email Address</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white break-all">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-105 dark:bg-slate-800 rounded-lg text-slate-500">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Account ID</p>
                <p className="text-xs font-mono text-slate-500 break-all">{user.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent searches history log */}
        <div className="lg:col-span-2">
          <MealHistoryTable />
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useMealStore } from "@/stores/mealStore";
import { ThemeToggle } from "./ThemeToggle";
import { LogOut, LayoutDashboard, Apple, LogIn, UserPlus, Utensils, LineChart } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    useMealStore.persist.rehydrate();
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isLoggedIn = mounted && !!user;

  return (
    <header className="sticky top-0 z-50 w-full h-[64px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-[0_10px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white skeuo-button border-none cursor-pointer"
          >
            <Apple className="w-5 h-5 fill-current" />
          </motion.div>
          <span className="font-headline font-bold text-sm sm:text-lg text-primary tracking-tight group-hover:text-primary-dark transition-colors truncate max-w-[130px] sm:max-w-none">
            Meal Calorie Studio
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1.5 sm:gap-2.5">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" passHref legacyBehavior>
                <motion.a
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    pathname === "/dashboard"
                      ? "bg-slate-100 dark:bg-slate-800 text-primary shadow-tactile-pressed"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="w-4.5 h-4.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </motion.a>
              </Link>
              <Link href="/calories" passHref legacyBehavior>
                <motion.a
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    pathname === "/calories"
                      ? "bg-slate-100 dark:bg-slate-800 text-primary shadow-tactile-pressed"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Apple className="w-4 h-4" />
                  <span className="hidden sm:inline">Lookup</span>
                </motion.a>
              </Link>
              <Link href="/meals" passHref legacyBehavior>
                <motion.a
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    pathname === "/meals"
                      ? "bg-slate-100 dark:bg-slate-800 text-primary shadow-tactile-pressed"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span className="hidden sm:inline">Meal Log</span>
                </motion.a>
              </Link>
              <Link href="/nutrition" passHref legacyBehavior>
                <motion.a
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    pathname === "/nutrition"
                      ? "bg-slate-100 dark:bg-slate-800 text-primary shadow-tactile-pressed"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <LineChart className="w-4 h-4" />
                  <span className="hidden sm:inline">Nutrition</span>
                </motion.a>
              </Link>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </motion.button>
            </>
          ) : (
            mounted && (
              <>
                <Link href="/login" passHref legacyBehavior>
                  <motion.a
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      pathname === "/login"
                        ? "bg-slate-100 dark:bg-slate-800 text-primary shadow-tactile-pressed"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </motion.a>
                </Link>
                <Link href="/register" passHref legacyBehavior>
                  <motion.a
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      pathname === "/register"
                        ? "bg-slate-100 dark:bg-slate-800 text-primary shadow-tactile-pressed"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Register</span>
                  </motion.a>
                </Link>
              </>
            )
          )}

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* Theme switcher */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

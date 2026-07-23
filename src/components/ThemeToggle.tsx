"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95, y: 1 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 rounded-xl bg-white dark:bg-surface-dark border-t border-white/85 dark:border-white/10 text-slate-800 dark:text-slate-200 shadow-tactile-raised dark:shadow-tactile-dark-raised flex items-center justify-center focus:outline-none cursor-pointer"
      aria-label="Toggle dark mode"
      id="theme-toggle-btn"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-500" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-500" />
      )}
    </motion.button>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, LayoutDashboard, AlertTriangle, Sparkles, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to console
    console.error("Application boundary caught error:", error);
  }, [error]);

  return (
    <div className="flex-grow min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-6 relative overflow-hidden font-body bg-[#f8f9fb] dark:bg-[#020617] text-slate-805 dark:text-white select-none">
      
      {/* Background Decorative Atmosphere Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* 500 Error Card */}
      <div className="w-full max-w-lg z-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800/30 rounded-[32px] p-8 md:p-10 shadow-xl flex flex-col items-center text-center">
          
          {/* Hybrid Blender Illustration Container */}
          <div className="relative w-full aspect-square max-w-[240px] mb-8 group">
            <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-full scale-95 group-hover:scale-100 transition-transform duration-700" />
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-full h-full rounded-[28px] overflow-hidden bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200/50 dark:border-slate-800 shadow-inner flex items-center justify-center">
                <img 
                  className="w-full h-full object-contain" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtTj--WhPfo0w6R96judNS0yUf3SP2-rx4ovqitPD3rxHxp08bF--2PATmiL3LVo2kO8zGPbEjGXWmkGt4qy7A0-LLOmPDpBhu_iLywSHNQUlvptHS_IrWR5E7GiGbW7ihszCci-wQZE-jvKl36C5jn2SS8XnhopLpHcKKb1cun8Z7UFs0qa0HBUlSRKKOYuax0ZfLEl3U-sp_m74Tu7t51PGh5R_Z7Ir5aCbWQxFMcy289B362RAVQKkvLs3XvgtEnc-6gKymfLw" 
                  alt="Kitchen blender error illustration"
                />
              </div>
            </div>
            
            {/* Floating 'Indigestion' warning tag */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 rounded-xl shadow-lg flex items-center justify-center text-white"
            >
              <AlertTriangle className="w-5 h-5 fill-current" />
            </motion.div>
          </div>

          {/* Heading and text message */}
          <div className="space-y-3 mb-8">
            <h1 className="text-xl md:text-2xl font-headline font-black text-slate-805 dark:text-white tracking-tight">
              Something went wrong in the kitchen.
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Our servers are having a bit of indigestion. We're working on a fix to get things back to healthy levels.
            </p>
            {error.message && (
              <p className="text-[10px] font-mono text-red-500/80 bg-red-500/5 px-3 py-1.5 rounded-lg border border-red-500/10 max-w-xs mx-auto truncate" title={error.message}>
                Details: {error.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button 
              onClick={() => reset()}
              className="flex-1 btn-skeuo-primary h-[50px] rounded-xl flex items-center justify-center gap-2 text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer focus:outline-none"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            
            <button 
              onClick={() => router.push("/dashboard")}
              className="flex-1 h-[50px] px-6 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs font-bold cursor-pointer focus:outline-none"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          {/* Diagnostic Info Strip */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-850 w-full flex items-center justify-center gap-3">
            <div className="flex -space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-white dark:border-slate-900 text-emerald-650 dark:text-emerald-500">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center border border-white dark:border-slate-900 text-amber-600 dark:text-amber-500">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-[9px] font-bold text-slate-450 uppercase tracking-widest leading-none">
              Error Status: 500 Internal Fault
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

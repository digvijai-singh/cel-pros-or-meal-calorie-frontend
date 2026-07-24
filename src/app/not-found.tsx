"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, History, Clock, HelpCircle, Sparkles, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  // 3D Card tilt states
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Limit rotation to max 12 degrees
    setRotateY((x / (rect.width / 2)) * 12);
    setRotateX(-(y / (rect.height / 2)) * 12);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="flex-grow min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-6 relative overflow-hidden font-body bg-[#f8f9fb] dark:bg-[#020617] text-slate-805 dark:text-white select-none">
      
      {/* Background Decorative Atmosphere Circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Tactile 3D 404 Card */}
      <motion.div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
        className="bg-white dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800/30 rounded-[32px] p-8 md:p-10 text-center shadow-xl w-full max-w-lg transition-transform duration-200 ease-out z-10"
      >
        {/* Visual Plate Illustration */}
        <div className="mb-8 relative inline-block">
          <div className="w-40 h-40 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 flex items-center justify-center mx-auto shadow-inner relative z-10">
            <UtensilsCrossed className="w-16 h-16 text-slate-300 dark:text-slate-700 select-none stroke-[1.25]" />
            
            {/* Sparkles / Help badges */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute top-3 right-3 text-primary"
            >
              <Sparkles className="w-5 h-5 fill-current" />
            </motion.div>
            
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute bottom-5 left-1 text-emerald-500"
            >
              <HelpCircle className="w-6 h-6" />
            </motion.div>
          </div>
          
          {/* Plate Shadow */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-32 h-3 bg-black/5 dark:bg-black/20 rounded-[100%] blur-md" />
        </div>

        {/* Text Area */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-headline font-black text-primary tracking-tighter mb-2">
            404
          </h1>
          <h2 className="text-base md:text-lg font-headline font-extrabold text-slate-800 dark:text-white leading-snug max-w-md mx-auto">
            Oops! This page seems to have wandered off the menu.
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            We couldn't find the ingredient or data you were looking for. It might have been deleted or moved to a different pantry.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => router.push("/dashboard")}
            className="btn-skeuo-primary px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all text-white text-xs cursor-pointer focus:outline-none"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
          
          <button 
            onClick={() => router.push("/meals")}
            className="px-6 py-3.5 rounded-xl font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer focus:outline-none"
          >
            <History className="w-4 h-4" />
            <span>View History</span>
          </button>
        </div>

        {/* Footer info strip */}
        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-850 flex items-center justify-center gap-3">
          <div className="flex -space-x-1.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center shadow-sm border border-white dark:border-slate-900 text-emerald-650 dark:text-emerald-500">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center shadow-sm border border-white dark:border-slate-900 text-amber-600 dark:text-amber-500">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Health Systems Nominal
          </p>
        </div>
      </motion.div>

      {/* Decorative Ceramic Plate render illustration */}
      <div className="mt-10 opacity-30 dark:opacity-20 grayscale pointer-events-none">
        <img 
          className="h-28 w-auto object-contain" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcGAeVh-Hl8M7pvr8TSs9MZFWEKS3U68sdBS4A3VN3Q_PobtzL_IHdmhMBlMArrJgakvQH8ZhP1DypDOfQMWMwJuG6v2C9x1DlcUji7dSwByBLK6Rq7Oayn--i-8W2-qKMXGHMfClCQv4d7PXEIbbtoaU5F80Zt_Oigb0BeBpLIulkAfW9Ry9xarRuRJjiqG7vB26mAwfoBYE46Bh5Es_29f2-bXub70P46q8WCejYu7XNsNlxHj83Y3jzQRQhL3XcZehx7GY_Pw4" 
          alt="Plate render"
        />
      </div>

    </div>
  );
}

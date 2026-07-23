"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

interface Step {
  targetId: string;
  title: string;
  text: string;
  stepNum: number;
}

const STEPS: Step[] = [
  {
    targetId: "daily-progress-widget",
    title: "Your Daily Balance",
    text: "Track your calorie budget and macronutrient distribution dynamically at a glance. It updates instantly whenever you log a meal.",
    stepNum: 1,
  },
  {
    targetId: "calories-lookup-link",
    title: "Quick Calorie Lookup",
    text: "Ready to log a meal? Click this lookup button to search for dishes, retrieve USDA facts, and recalculate serving sizes.",
    stepNum: 2,
  },
  {
    targetId: "recent-meals-widget",
    title: "Your Query History",
    text: "Review your previously logged meals here. Click any meal in the history list to quickly view its detailed reports.",
    stepNum: 3,
  },
];

export function OnboardingTour() {
  const { hasCompletedTour, setHasCompletedTour } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlight, setSpotlight] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (hasCompletedTour || !mounted) return;

    const updateSpotlight = () => {
      const targetId = STEPS[currentStep].targetId;
      const element = document.getElementById(targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        const padding = 12;
        setSpotlight({
          x: rect.left + window.scrollX - padding,
          y: rect.top + window.scrollY - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
        });
      } else {
        setSpotlight(null);
      }
    };

    // Delay slightly to allow layout and hydration shifts to stabilize
    const timer = setTimeout(updateSpotlight, 150);

    window.addEventListener("resize", updateSpotlight);
    window.addEventListener("scroll", updateSpotlight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateSpotlight);
      window.removeEventListener("scroll", updateSpotlight);
    };
  }, [currentStep, hasCompletedTour, mounted]);

  if (hasCompletedTour || !mounted || !spotlight) return null;

  const step = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setHasCompletedTour(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    setHasCompletedTour(true);
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden select-none pointer-events-none">
      {/* 1. Spotlight Cutout Overlay Mask */}
      <div 
        style={{
          position: "absolute",
          left: spotlight.x,
          top: spotlight.y,
          width: spotlight.width,
          height: spotlight.height,
          borderRadius: "20px",
          boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.65)",
          zIndex: 65,
          border: "2.5px solid #1a73e8",
          pointerEvents: "none",
          transition: "all 0.3s ease-in-out",
        }}
        className="backdrop-blur-[1.5px]"
      />

      {/* 2. Skip Tour Button */}
      <button 
        onClick={handleSkip}
        className="absolute top-4 right-4 text-xs font-bold text-white/90 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md cursor-pointer pointer-events-auto shadow-sm focus:outline-none transition-all"
      >
        Skip Tour
      </button>

      {/* 3. Floating Tooltip Dialog Box */}
      <div className="absolute bottom-[44px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-sm z-[70] pointer-events-auto">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="skeuo-card p-5 border border-white dark:border-slate-800 relative bg-white dark:bg-slate-900"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-primary-container flex items-center justify-center text-white shrink-0 skeuo-button border-none">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-left">
              <h4 className="text-sm font-headline font-extrabold text-slate-800 dark:text-white">
                {step.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-body">
                {step.text}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-4 font-body">
            {/* Step Indicators */}
            <div className="flex gap-1.5">
              {STEPS.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-305 ${
                    idx === currentStep 
                      ? "w-6 bg-primary shadow-[0_0_8px_rgba(26,115,232,0.4)]" 
                      : "w-2 bg-slate-200 dark:bg-slate-800"
                  }`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {currentStep > 0 && (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleBack}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </motion.button>
              )}
              
              <motion.button 
                whileHover={{ scale: 1.02, y: -0.5 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-white font-bold skeuo-button border-none text-xs cursor-pointer focus:outline-none"
              >
                <span>{currentStep === STEPS.length - 1 ? "Finish Tour" : "Next"}</span>
                {currentStep === STEPS.length - 1 ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

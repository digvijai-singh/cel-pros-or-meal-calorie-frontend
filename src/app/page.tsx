"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";

export default function RootPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const hasHydrated = useAuthStore.persist.hasHydrated();
    
    const checkRedirect = () => {
      const currentToken = useAuthStore.getState().token;
      if (currentToken) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    };

    if (hasHydrated) {
      checkRedirect();
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(() => {
        checkRedirect();
      });
      return () => unsub();
    }
  }, [router, token]);

  return (
    <div className="flex flex-1 items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500 mx-auto" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-450">Loading profile state...</p>
      </div>
    </div>
  );
}

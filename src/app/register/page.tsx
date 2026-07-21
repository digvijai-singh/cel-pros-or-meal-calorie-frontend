"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { AuthForm } from "@/components/AuthForm";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const hasHydrated = useAuthStore.persist.hasHydrated();
    
    if (hasHydrated) {
      if (token) {
        router.replace("/dashboard");
      } else {
        setMounted(true);
      }
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(() => {
        if (useAuthStore.getState().token) {
          router.replace("/dashboard");
        } else {
          setMounted(true);
        }
      });
      return () => unsub();
    }
  }, [router, token]);

  if (!mounted) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center py-12">
      <AuthForm mode="register" />
    </div>
  );
}

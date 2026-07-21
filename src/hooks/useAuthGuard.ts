import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export function useAuthGuard() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Wait for store to hydrate from localStorage
    const hasHydrated = useAuthStore.persist.hasHydrated();
    
    if (hasHydrated) {
      if (!token) {
        router.replace("/login");
      } else {
        setIsAuthorized(true);
      }
    } else {
      // Set up a listener for hydration completion
      const unsubHydrate = useAuthStore.persist.onHydrate(() => {});
      const unsubFinishHydration = useAuthStore.persist.onFinishHydration(() => {
        if (!useAuthStore.getState().token) {
          router.replace("/login");
        } else {
          setIsAuthorized(true);
        }
      });
      return () => {
        unsubHydrate();
        unsubFinishHydration();
      };
    }
  }, [token, router]);

  return { isAuthorized, token };
}

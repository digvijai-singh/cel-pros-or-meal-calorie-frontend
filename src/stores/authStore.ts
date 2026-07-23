import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  hasCompletedTour: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setHasCompletedTour: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hasCompletedTour: false,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      setHasCompletedTour: (val) => set({ hasCompletedTour: val }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

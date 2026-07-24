import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types";
import { useMealStore } from "./mealStore";

interface AuthState {
  token: string | null;
  user: User | null;
  hasCompletedTour: boolean;
  completedTours: Record<string, boolean>;
  login: (token: string, user: User) => void;
  logout: () => void;
  setHasCompletedTour: (val: boolean) => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hasCompletedTour: false,
      completedTours: {},
      
      login: (token, user) => set((state) => {
        const nextCompletedTour = !!state.completedTours[user.email];
        
        // Manually write update to localStorage for auth-storage so it's instantly visible to getActiveUserEmail()
        if (typeof window !== "undefined") {
          const authState = {
            state: {
              token,
              user,
              hasCompletedTour: nextCompletedTour,
              completedTours: state.completedTours
            },
            version: 0
          };
          localStorage.setItem("auth-storage", JSON.stringify(authState));
          
          // Rehydrate mealStore synchronously for the logged in user
          useMealStore.persist.rehydrate();
        }

        return { 
          token, 
          user, 
          hasCompletedTour: nextCompletedTour 
        };
      }),
      
      logout: () => set((state) => {
        // Clear active session in localStorage
        if (typeof window !== "undefined") {
          const authState = {
            state: {
              token: null,
              user: null,
              hasCompletedTour: false,
              completedTours: state.completedTours
            },
            version: 0
          };
          localStorage.setItem("auth-storage", JSON.stringify(authState));
          
          // Rehydrate mealStore to clear active memory and load anonymous / empty state
          useMealStore.persist.rehydrate();
        }

        return { 
          token: null, 
          user: null, 
          hasCompletedTour: false 
        };
      }),
      
      setHasCompletedTour: (val) => set((state) => {
        const user = state.user;
        const nextCompletedTours = user 
          ? { ...state.completedTours, [user.email]: val } 
          : state.completedTours;

        if (typeof window !== "undefined") {
          const authState = {
            state: {
              token: state.token,
              user,
              hasCompletedTour: val,
              completedTours: nextCompletedTours
            },
            version: 0
          };
          localStorage.setItem("auth-storage", JSON.stringify(authState));
        }

        return {
          hasCompletedTour: val,
          completedTours: nextCompletedTours
        };
      }),
      
      updateUser: (updatedUser) => set((state) => ({
        user: state.user ? { ...state.user, ...updatedUser } : null
      })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

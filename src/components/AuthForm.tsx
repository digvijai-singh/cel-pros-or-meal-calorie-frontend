"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { register as apiRegister, login as apiLogin, ApiError } from "@/lib/api";
import { RegisterSchema, LoginSchema, RegisterInput, LoginInput } from "@/lib/validations";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const loginAction = useAuthStore((state) => state.login);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = mode === "login";

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isLogin ? LoginSchema : RegisterSchema),
    defaultValues: isLogin
      ? { email: "", password: "" }
      : { first_name: "", last_name: "", email: "", password: "" },
  });

  const onSubmit = async (data: any) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await apiLogin(data as LoginInput);
        setSuccessMsg("Login successful! Redirecting...");
        loginAction(res.token, res.user);
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      } else {
        const res = await apiRegister(data as RegisterInput);
        setSuccessMsg("Registration successful! Redirecting...");
        loginAction(res.token, res.user);
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          setErrorMsg("This email is already registered.");
        } else if (error.status === 401) {
          setErrorMsg("Invalid credentials. Please verify your email and password.");
        } else if (error.status === 400) {
          setErrorMsg(
            Array.isArray(error.info?.message)
              ? error.info.message.join(", ")
              : error.message || "Invalid form data."
          );
        } else if (error.status === 429) {
          setErrorMsg("Too many authentication attempts. Please try again later.");
        } else {
          setErrorMsg(error.message || "An unexpected error occurred.");
        }
      } else {
        setErrorMsg("Failed to connect to the server. Please check your internet connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl transition-all">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {isLogin ? "Sign in to track your calories" : "Register to start checking dish nutrition"}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg flex items-start gap-2.5 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-start gap-2.5 text-sm">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                {...registerField("first_name")}
                className="w-full px-3.5 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-slate-200 dark:border-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm"
                placeholder="John"
                disabled={isLoading}
              />
              {errors.first_name && (
                <p className="text-xs text-red-500 mt-1">{errors.first_name.message as string}</p>
              )}
            </div>
            <div>
              <label htmlFor="last_name" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                {...registerField("last_name")}
                className="w-full px-3.5 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-slate-200 dark:border-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm"
                placeholder="Doe"
                disabled={isLoading}
              />
              {errors.last_name && (
                <p className="text-xs text-red-500 mt-1">{errors.last_name.message as string}</p>
              )}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...registerField("email")}
            className="w-full px-3.5 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-slate-200 dark:border-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm"
            placeholder="you@example.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...registerField("password")}
            className="w-full px-3.5 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-slate-200 dark:border-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm"
            placeholder="••••••••"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message as string}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 dark:disabled:bg-amber-800 text-white font-semibold rounded-lg transition-colors cursor-pointer text-sm shadow-md"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Please wait...</span>
            </>
          ) : (
            <span>{isLogin ? "Sign In" : "Register"}</span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center border-t border-slate-100 dark:border-slate-800 pt-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link
            href={isLogin ? "/register" : "/login"}
            className="text-amber-500 hover:text-amber-600 font-semibold transition-colors"
          >
            {isLogin ? "Register here" : "Sign in here"}
          </Link>
        </p>
      </div>
    </div>
  );
}

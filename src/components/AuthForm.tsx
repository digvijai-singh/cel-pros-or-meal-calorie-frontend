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
import { motion } from "framer-motion";

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
    resolver: zodResolver(isLogin ? LoginSchema : RegisterSchema) as any,
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
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="w-full max-w-md mx-auto p-7 skeuo-card border border-slate-200/20 dark:border-slate-800/30"
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-headline font-bold text-slate-800 dark:text-white tracking-tight">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-body">
          {isLogin ? "Sign in to track your calories" : "Register to start checking dish nutrition"}
        </p>
      </div>

      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-900/50 text-red-650 dark:text-red-400 rounded-xl flex items-start gap-2.5 text-xs font-body"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/50 text-emerald-650 dark:text-emerald-400 rounded-xl flex items-start gap-2.5 text-xs font-body"
        >
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-body">
        {!isLogin && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                {...registerField("first_name")}
                className="w-full px-3.5 py-2.5 border skeuo-input text-slate-800 dark:text-white focus:ring-0 outline-none text-sm"
                placeholder="John"
                disabled={isLoading}
              />
              {errors.first_name && (
                <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.first_name.message as string}</p>
              )}
            </div>
            <div>
              <label htmlFor="last_name" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                {...registerField("last_name")}
                className="w-full px-3.5 py-2.5 border skeuo-input text-slate-800 dark:text-white focus:ring-0 outline-none text-sm"
                placeholder="Doe"
                disabled={isLoading}
              />
              {errors.last_name && (
                <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.last_name.message as string}</p>
              )}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...registerField("email")}
            className="w-full px-3.5 py-2.5 border skeuo-input text-slate-800 dark:text-white focus:ring-0 outline-none text-sm"
            placeholder="you@example.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.email.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...registerField("password")}
            className="w-full px-3.5 py-2.5 border skeuo-input text-slate-800 dark:text-white focus:ring-0 outline-none text-sm"
            placeholder="••••••••"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.password.message as string}</p>
          )}
        </div>

        <motion.button
          whileHover={isLoading ? {} : { scale: 1.01, y: -1 }}
          whileTap={isLoading ? {} : { scale: 0.98, y: 1 }}
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 skeuo-button text-white font-bold rounded-xl transition-all cursor-pointer text-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Please wait...</span>
            </>
          ) : (
            <span>{isLogin ? "Sign In" : "Register"}</span>
          )}
        </motion.button>
      </form>

      <div className="mt-6 text-center border-t border-slate-100 dark:border-slate-850 pt-4 font-body">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link
            href={isLogin ? "/register" : "/login"}
            className="text-primary hover:text-primary-dark font-bold transition-colors"
          >
            {isLogin ? "Register here" : "Sign in here"}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

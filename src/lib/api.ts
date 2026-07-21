import { useAuthStore } from "@/stores/authStore";
import { AuthResponse, CalorieResult } from "@/types";
import { RegisterInput, LoginInput, MealFormInput } from "./validations";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://xpcc.devb.zeak.io";

export class ApiError extends Error {
  status: number;
  info: any;
  retryAfter?: number;

  constructor(message: string, status: number, info: any, retryAfter?: number) {
    super(message);
    this.status = status;
    this.info = info;
    this.retryAfter = retryAfter;
  }
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = useAuthStore.getState().token;
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  let data: any = null;
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      // Ignore JSON parse errors
    }
  }

  if (!res.ok) {
    if (res.status === 403) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new ApiError("Session expired. Please log in again.", 403, data);
    }

    if (res.status === 429) {
      let retryAfter = 60;
      if (data && typeof data.retryAfter === "number") {
        retryAfter = data.retryAfter;
      } else if (res.headers.has("Retry-After")) {
        const retryHeader = res.headers.get("Retry-After");
        if (retryHeader) {
          retryAfter = parseInt(retryHeader, 10) || 60;
        }
      }
      throw new ApiError(data?.message || "Too many requests. Please try again later.", 429, data, retryAfter);
    }

    const errorMsg = data?.message || data?.error || `Request failed with status ${res.status}`;
    throw new ApiError(errorMsg, res.status, data);
  }

  return data;
}

export async function register(payload: RegisterInput): Promise<AuthResponse> {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: LoginInput): Promise<AuthResponse> {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCalories(payload: MealFormInput): Promise<CalorieResult> {
  return apiFetch("/api/get-calories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

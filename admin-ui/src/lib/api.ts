import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const TOKEN_KEY = "spensavote_admin_token";
export const USER_KEY = "spensavote_admin_user";

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function setAuthSession(token: string, user: any) {
  Cookies.set(TOKEN_KEY, token, { expires: 1 }); // 1 day
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearAuthSession() {
  Cookies.remove(TOKEN_KEY);
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
}

export function getStoredUser(): any | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(USER_KEY);
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  token?: string;
  user?: any;
  [key: string]: any;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { requiresAuth = true, headers = {}, ...restOptions } = options;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: defaultHeaders,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401 && requiresAuth) {
        clearAuthSession();
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
      return {
        success: false,
        message: data?.message || `Request failed with status ${response.status}`,
        error: data?.error,
        data: data?.data,
      };
    }

    return data || { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Terjadi kesalahan jaringan atau server tidak dapat dijangkau",
    };
  }
}

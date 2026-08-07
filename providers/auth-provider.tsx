"use client";

import * as React from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string }) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

const API_BASE = "/api/users";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("aquabest-token");
}

function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("aquabest-token", token);
  else localStorage.removeItem("aquabest-token");
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(options.headers as Record<string, string> || {}) };
  if (token) headers["Authorization"] = `JWT ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    const errors = data.errors || [{ message: "Something went wrong" }];
    throw new Error(errors[0]?.message || "Request failed");
  }
  return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [token, setTokenState] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = getToken();
    if (t) {
      setTokenState(t);
      apiFetch("/me")
        .then((data) => setUser(data.user || data))
        .catch(() => { setToken(null); setTokenState(null); });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }).then(r => r.json());
      if (data.token) {
        setToken(data.token);
        setTokenState(data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.errors?.[0]?.message || "Invalid credentials" };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await apiFetch("", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role: "customer", status: "active" }),
      });
      if (data.doc) {
        const loginResult = await login(email, password);
        return loginResult;
      }
      return { success: false, error: "Registration failed" };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const logout = async () => {
    try { await apiFetch("/logout", { method: "POST" }); } catch {}
    setUser(null);
    setToken(null);
    setTokenState(null);
  };

  const updateProfile = async (data: { name?: string }) => {
    try {
      if (!user) return false;
      const result = await apiFetch(`/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      if (result.doc) {
        setUser(prev => prev ? { ...prev, name: result.doc.name } : null);
        return true;
      }
      return false;
    } catch { return false; }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await apiFetch("/me", {
        method: "PATCH",
        body: JSON.stringify({ password: newPassword, password_confirm: currentPassword }),
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.token) return { success: true };
      return { success: false, error: "Reset failed. The link may have expired." };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const value = React.useMemo(() => ({
    user, token, loading, login, register, logout, updateProfile, changePassword, forgotPassword, resetPassword,
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

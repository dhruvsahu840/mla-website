"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";

export type AdminUser = { id: string; name?: string; email: string; role: "ADMIN" | "STAFF" };

type AdminAuthContextValue = {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const res = await apiGet<AdminUser>("/api/auth/me");
      setAdmin(res.success ? res.data : null);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const res = await apiPost<AdminUser>("/api/auth/login", { email, password });
    if (res.success && res.data) {
      setAdmin(res.data);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || "लॉगिन विफल" };
  }

  async function logout() {
    await apiPost("/api/auth/logout", {});
    setAdmin(null);
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, refresh }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

/** Redirects to /admin/login if not authenticated. Wrap protected admin pages with this. */
export function useRequireAdmin() {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !admin) {
      router.replace("/admin/login");
    }
  }, [loading, admin, router]);

  return { admin, loading };
}

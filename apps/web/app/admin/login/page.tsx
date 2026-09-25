"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import { site } from "@/lib/site-content";

export default function AdminLoginPage() {
  const { admin, loading, login } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && admin) router.replace("/admin");
  }, [loading, admin, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      router.replace("/admin");
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="h-12 w-12 rounded-full bg-primary-light border border-primary/20 flex items-center justify-center text-primary font-display font-bold mx-auto">
            MLA
          </div>
          <h1 className="font-display text-xl font-bold text-ink mt-3">एडमिन पैनल</h1>
          <p className="text-sm text-muted mt-1">{site.mlaName} — प्रबंधन डैशबोर्ड</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-ink mb-1.5">ईमेल</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-ink mb-1.5">पासवर्ड</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
            लॉगिन करें
          </button>
        </form>

        <p className="text-xs text-muted text-center mt-5">
          स्टाफ और एडमिन/विधायक — दोनों एक ही फॉर्म से लॉगिन करें, अनुमतियां भूमिका अनुसार अलग होंगी।
        </p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, FormEvent } from "react";
import { Loader2, Save, ShieldAlert } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { apiGet, apiPut } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";

const fields: { key: string; label: string; placeholder?: string }[] = [
  { key: "mlaName", label: "विधायक का नाम" },
  { key: "tagline", label: "टैगलाइन" },
  { key: "constituency", label: "विधानसभा क्षेत्र का नाम" },
  { key: "phone", label: "फोन नंबर" },
  { key: "email", label: "ईमेल" },
  { key: "address", label: "कार्यालय पता" },
  { key: "officeHours", label: "कार्यालय समय" },
  { key: "facebook", label: "Facebook लिंक" },
  { key: "twitter", label: "Twitter / X लिंक" },
  { key: "instagram", label: "Instagram लिंक" },
  { key: "youtube", label: "YouTube लिंक" },
];

export default function AdminSettingsPage() {
  const { admin } = useAdminAuth();
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiGet<Record<string, string>>("/api/settings").then((res) => {
      if (res.success && res.data) setValues(res.data);
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    const res = await apiPut("/api/settings", values);
    setSubmitting(false);
    setMessage(res.success ? "सेटिंग्स सहेजी गईं।" : res.message || "सहेजने में विफल रहा।");
  }

  if (admin && admin.role !== "ADMIN") {
    return (
      <AdminShell title="सेटिंग्स">
        <div className="bg-white border border-line rounded-2xl p-8 text-center max-w-md mx-auto">
          <ShieldAlert className="mx-auto text-accent" size={32} />
          <p className="text-sm text-muted mt-3">केवल एडमिन/विधायक ही सेटिंग्स बदल सकते हैं।</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="वेबसाइट सेटिंग्स">
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-6 max-w-2xl space-y-5">
          {fields.map((f) => (
            <div key={f.key}>
              <label htmlFor={f.key} className="block text-sm font-semibold text-ink mb-1.5">{f.label}</label>
              <input
                id={f.key}
                value={values[f.key] || ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary"
              />
            </div>
          ))}

          {message && (
            <p className="text-sm bg-primary-light text-primary-dark rounded-lg px-4 py-2.5">{message}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
          >
            {submitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            सहेजें
          </button>
        </form>
      )}
    </AdminShell>
  );
}

"use client";

import { useEffect, useState, FormEvent } from "react";
import { Loader2, UserPlus, ShieldAlert, Ban, CheckCircle2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { apiGet, apiPost, apiPatch } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";

type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  status: "ACTIVE" | "DISABLED";
  lastLoginAt: string | null;
  createdAt: string;
};

export default function AdminStaffPage() {
  const { admin } = useAdminAuth();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STAFF" as "ADMIN" | "STAFF" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await apiGet<StaffUser[]>("/api/auth/staff");
    if (res.success && res.data) setUsers(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await apiPost("/api/auth/staff", form);
    setSubmitting(false);
    if (res.success) {
      setForm({ name: "", email: "", password: "", role: "STAFF" });
      load();
    } else {
      setError(res.message || "खाता नहीं बनाया जा सका।");
    }
  }

  async function toggleStatus(user: StaffUser) {
    const newStatus = user.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    const res = await apiPatch(`/api/auth/staff/${user.id}/status`, { status: newStatus });
    if (res.success) load();
    else alert(res.message);
  }

  if (admin && admin.role !== "ADMIN") {
    return (
      <AdminShell title="स्टाफ प्रबंधन">
        <div className="bg-white border border-line rounded-2xl p-8 text-center max-w-md mx-auto">
          <ShieldAlert className="mx-auto text-accent" size={32} />
          <p className="text-sm text-muted mt-3">केवल एडमिन/विधायक ही स्टाफ खाते प्रबंधित कर सकते हैं।</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="स्टाफ प्रबंधन">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={28} /></div>
          ) : (
            <div className="bg-white border border-line rounded-2xl overflow-hidden">
              <div className="divide-y divide-line">
                {users.map((u) => (
                  <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                    <div>
                      <p className="text-sm font-semibold text-ink">{u.name}</p>
                      <p className="text-xs text-muted mt-0.5">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold bg-primary-light text-primary-dark rounded-full px-3 py-1">
                        {u.role === "ADMIN" ? "एडमिन" : "स्टाफ"}
                      </span>
                      <span className={`text-xs font-semibold rounded-full px-3 py-1 ${u.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {u.status === "ACTIVE" ? "सक्रिय" : "निष्क्रिय"}
                      </span>
                      {u.id !== admin?.id && (
                        <button
                          onClick={() => toggleStatus(u)}
                          className="p-2 rounded-lg hover:bg-primary-light text-primary"
                          aria-label={u.status === "ACTIVE" ? "निष्क्रिय करें" : "सक्रिय करें"}
                        >
                          {u.status === "ACTIVE" ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <form onSubmit={handleCreate} className="bg-white border border-line rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-ink flex items-center gap-2">
              <UserPlus size={18} className="text-primary" /> नया खाता जोड़ें
            </h3>
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-ink mb-1.5">नाम</label>
              <input id="name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label htmlFor="s-email" className="block text-sm font-semibold text-ink mb-1.5">ईमेल</label>
              <input id="s-email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label htmlFor="s-password" className="block text-sm font-semibold text-ink mb-1.5">पासवर्ड (न्यूनतम 8 अक्षर)</label>
              <input id="s-password" type="password" required minLength={8} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label htmlFor="s-role" className="block text-sm font-semibold text-ink mb-1.5">भूमिका</label>
              <select id="s-role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "ADMIN" | "STAFF" }))} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm bg-white">
                <option value="STAFF">स्टाफ</option>
                <option value="ADMIN">एडमिन</option>
              </select>
            </div>
            {error && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg text-sm">
              {submitting ? <Loader2 className="animate-spin" size={16} /> : <UserPlus size={16} />}
              खाता बनाएं
            </button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}

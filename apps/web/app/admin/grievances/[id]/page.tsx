"use client";

import { useEffect, useState, use as usePromise } from "react";
import { Loader2, Phone, Mail, MapPin, Send } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { apiGet, apiPatch } from "@/lib/api";

type Update = { status: string; message: string; createdAt: string };
type Grievance = {
  id: string;
  referenceNumber: string;
  name: string;
  phone: string;
  email: string | null;
  category: string;
  subject: string;
  description: string;
  location: string | null;
  status: string;
  priority: string;
  createdAt: string;
  updates: Update[];
};

const statusOptions = [
  { value: "UNDER_REVIEW", label: "समीक्षा में" },
  { value: "ASSIGNED", label: "आवंटित" },
  { value: "IN_PROGRESS", label: "प्रगति में" },
  { value: "NEED_MORE_INFO", label: "अधिक जानकारी आवश्यक" },
  { value: "RESOLVED", label: "समाधान हुआ" },
  { value: "CLOSED", label: "बंद" },
  { value: "REJECTED", label: "अस्वीकृत" },
];

const statusLabels: Record<string, string> = {
  SUBMITTED: "दर्ज हुई",
  UNDER_REVIEW: "समीक्षा में",
  ASSIGNED: "आवंटित",
  IN_PROGRESS: "प्रगति में",
  NEED_MORE_INFO: "जानकारी आवश्यक",
  RESOLVED: "समाधान हुआ",
  CLOSED: "बंद",
  REJECTED: "अस्वीकृत",
};

export default function GrievanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await apiGet<Grievance>(`/api/grievances/${id}`);
    if (res.success && res.data) setGrievance(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleUpdate() {
    if (!newStatus || !message.trim()) {
      setError("कृपया स्थिति चुनें और संदेश लिखें।");
      return;
    }
    setSubmitting(true);
    setError("");
    const res = await apiPatch(`/api/grievances/${id}/status`, { status: newStatus, message });
    setSubmitting(false);
    if (res.success) {
      setNewStatus("");
      setMessage("");
      load();
    } else {
      setError(res.message || "अपडेट विफल रहा।");
    }
  }

  return (
    <AdminShell title="शिकायत विवरण">
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : !grievance ? (
        <p className="text-muted">शिकायत नहीं मिली।</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-line rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-sm text-muted">{grievance.referenceNumber}</p>
                <span className="text-xs font-semibold bg-primary-light text-primary-dark rounded-full px-3 py-1">
                  {statusLabels[grievance.status] || grievance.status}
                </span>
              </div>
              <h2 className="font-display text-xl font-bold text-ink mt-3">{grievance.subject}</h2>
              <p className="text-sm text-muted mt-2 leading-relaxed">{grievance.description}</p>

              <div className="grid sm:grid-cols-2 gap-3 mt-5 text-sm">
                <p className="flex items-center gap-2 text-ink"><Phone size={14} className="text-primary" /> {grievance.phone}</p>
                {grievance.email && <p className="flex items-center gap-2 text-ink"><Mail size={14} className="text-primary" /> {grievance.email}</p>}
                {grievance.location && <p className="flex items-center gap-2 text-ink sm:col-span-2"><MapPin size={14} className="text-primary" /> {grievance.location}</p>}
              </div>
            </div>

            <div className="bg-white border border-line rounded-2xl p-6">
              <h3 className="font-display font-bold text-ink mb-4">स्थिति इतिहास</h3>
              <ol className="space-y-4 border-l-2 border-line pl-4">
                {grievance.updates.map((u, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                    <p className="text-sm font-semibold text-ink">{statusLabels[u.status] || u.status}</p>
                    <p className="text-sm text-muted">{u.message}</p>
                    <p className="text-xs text-muted mt-1">{new Date(u.createdAt).toLocaleString("hi-IN")}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="bg-white border border-line rounded-2xl p-6 h-fit">
            <h3 className="font-display font-bold text-ink mb-4">स्थिति अपडेट करें</h3>
            <label htmlFor="status" className="block text-sm font-semibold text-ink mb-1.5">नई स्थिति</label>
            <select
              id="status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm mb-4 bg-white"
            >
              <option value="">चुनें</option>
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <label htmlFor="message" className="block text-sm font-semibold text-ink mb-1.5">टिप्पणी</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="नागरिक को दिखाई जाने वाली टिप्पणी लिखें"
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm mb-4"
            />

            {error && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>}

            <button
              onClick={handleUpdate}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg text-sm"
            >
              {submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              अपडेट भेजें
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

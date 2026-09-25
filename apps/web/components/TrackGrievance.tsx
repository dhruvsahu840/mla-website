"use client";

import { useState, FormEvent } from "react";
import { Search, Loader2 } from "lucide-react";
import { apiGet } from "@/lib/api";

type Update = { status: string; message: string; createdAt: string };
type Grievance = {
  referenceNumber: string;
  category: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  updates: Update[];
};

const statusLabels: Record<string, string> = {
  SUBMITTED: "दर्ज हुई",
  UNDER_REVIEW: "समीक्षा में",
  ASSIGNED: "आवंटित",
  IN_PROGRESS: "प्रगति में",
  NEED_MORE_INFO: "अधिक जानकारी आवश्यक",
  RESOLVED: "समाधान हुआ",
  CLOSED: "बंद",
  REJECTED: "अस्वीकृत",
};

export default function TrackGrievance() {
  const [refInput, setRefInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Grievance | null>(null);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await apiGet<Grievance>(`/api/grievances/track?referenceNumber=${encodeURIComponent(refInput.trim())}`);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError(res.message || "कोई शिकायत नहीं मिली।");
      }
    } catch {
      setError("सर्वर से संपर्क नहीं हो सका। कृपया बाद में पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="ref" className="sr-only">संदर्भ क्रमांक</label>
        <input
          id="ref"
          value={refInput}
          onChange={(e) => setRefInput(e.target.value)}
          required
          placeholder="संदर्भ क्रमांक दर्ज करें (जैसे GRV-2026-XXXXXX)"
          className="flex-1 rounded-lg border border-line px-4 py-3 text-sm focus:border-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg text-sm"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
          खोजें
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-6 bg-white border border-line rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-sm text-muted">{result.referenceNumber}</p>
            <span className="text-xs font-semibold bg-primary-light text-primary-dark rounded-full px-3 py-1">
              {statusLabels[result.status] || result.status}
            </span>
          </div>
          <h2 className="font-display font-bold text-ink text-lg mt-3">{result.subject}</h2>

          <ol className="mt-6 space-y-4 border-l-2 border-line pl-4">
            {result.updates.map((u, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <p className="text-sm font-semibold text-ink">{statusLabels[u.status] || u.status}</p>
                <p className="text-sm text-muted">{u.message}</p>
                <p className="text-xs text-muted mt-1">{new Date(u.createdAt).toLocaleDateString("hi-IN")}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

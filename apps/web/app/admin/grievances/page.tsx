"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { apiGet } from "@/lib/api";

type Grievance = {
  id: string;
  referenceNumber: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  name: string;
  phone: string;
  createdAt: string;
};

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

const statusFilters = ["ALL", ...Object.keys(statusLabels)];

export default function AdminGrievancesPage() {
  const [items, setItems] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    setLoading(true);
    const qs = filter === "ALL" ? "" : `?status=${filter}`;
    apiGet<Grievance[]>(`/api/grievances${qs}`).then((res) => {
      if (res.success && res.data) setItems(res.data);
      setLoading(false);
    });
  }, [filter]);

  return (
    <AdminShell title="शिकायत प्रबंधन">
      <div className="flex flex-wrap gap-2 mb-6">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
              filter === s ? "bg-primary text-white" : "bg-white border border-line text-ink hover:border-primary"
            }`}
          >
            {s === "ALL" ? "सभी" : statusLabels[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : (
        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          {items.length === 0 && <p className="p-6 text-sm text-muted">कोई शिकायत नहीं मिली।</p>}
          <div className="divide-y divide-line">
            {items.map((g) => (
              <Link key={g.id} href={`/admin/grievances/${g.id}`} className="flex flex-wrap items-center gap-3 justify-between p-5 hover:bg-primary-light/40 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{g.subject}</p>
                  <p className="text-xs text-muted mt-1 font-mono">{g.referenceNumber}</p>
                  <p className="text-xs text-muted mt-0.5">{g.name} • {g.phone} • {new Date(g.createdAt).toLocaleDateString("hi-IN")}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-primary bg-primary-light rounded-full px-3 py-1">{g.category}</span>
                  <span className="text-xs font-semibold bg-accent-light text-accent-dark rounded-full px-3 py-1">
                    {statusLabels[g.status] || g.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

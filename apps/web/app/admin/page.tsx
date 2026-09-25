"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileWarning, CheckCircle2, Newspaper, Mail, Loader2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { apiGet } from "@/lib/api";

type Stats = {
  totalGrievances: number;
  openGrievances: number;
  resolvedGrievances: number;
  totalPosts: number;
  publishedPosts: number;
  newMessages: number;
  recentGrievances: { id: string; referenceNumber: string; subject: string; status: string; category: string; createdAt: string }[];
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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Stats>("/api/dashboard/stats").then((res) => {
      if (res.success && res.data) setStats(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <AdminShell title="डैशबोर्ड">
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : stats ? (
        <div className="space-y-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard icon={FileWarning} label="कुल शिकायतें" value={stats.totalGrievances} color="accent" />
            <StatCard icon={FileWarning} label="खुली शिकायतें" value={stats.openGrievances} color="accent" />
            <StatCard icon={CheckCircle2} label="समाधान हुईं" value={stats.resolvedGrievances} color="primary" />
            <StatCard icon={Newspaper} label="प्रकाशित समाचार" value={`${stats.publishedPosts}/${stats.totalPosts}`} color="primary" />
          </div>

          <div className="bg-white border border-line rounded-2xl p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink mb-4">
              <Mail size={16} className="text-primary" /> संपर्क संदेश: {stats.newMessages}
            </div>
          </div>

          <div className="bg-white border border-line rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-line">
              <h2 className="font-display font-bold text-ink">हाल की शिकायतें</h2>
              <Link href="/admin/grievances" className="text-sm font-semibold text-primary hover:underline">सभी देखें →</Link>
            </div>
            <div className="divide-y divide-line">
              {stats.recentGrievances.length === 0 && (
                <p className="p-5 text-sm text-muted">अभी तक कोई शिकायत दर्ज नहीं हुई।</p>
              )}
              {stats.recentGrievances.map((g) => (
                <Link key={g.id} href={`/admin/grievances/${g.id}`} className="flex items-center justify-between p-5 hover:bg-primary-light/40 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{g.subject}</p>
                    <p className="text-xs text-muted mt-0.5 font-mono">{g.referenceNumber}</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold bg-primary-light text-primary-dark rounded-full px-3 py-1 ml-3">
                    {statusLabels[g.status] || g.status}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-muted">डेटा लोड नहीं हो सका।</p>
      )}
    </AdminShell>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: "primary" | "accent" }) {
  return (
    <div className="bg-white border border-line rounded-2xl p-5 flex items-center gap-4">
      <span className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 ${color === "primary" ? "bg-primary-light text-primary" : "bg-accent-light text-accent"}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className="font-display text-xl font-bold text-ink">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}

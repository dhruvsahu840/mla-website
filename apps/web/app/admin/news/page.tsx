"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Trash2, Pencil } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { apiGet, apiDelete } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";

type Post = { id: string; title: string; slug: string; status: string; category: string | null; createdAt: string };

const statusLabels: Record<string, string> = { DRAFT: "ड्राफ्ट", PUBLISHED: "प्रकाशित", ARCHIVED: "संग्रहीत" };

export default function AdminNewsPage() {
  const { admin } = useAdminAuth();
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await apiGet<Post[]>("/api/posts/admin/all");
    if (res.success && res.data) setItems(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("क्या आप वाकई इस समाचार को हटाना चाहते हैं?")) return;
    const res = await apiDelete(`/api/posts/admin/${id}`);
    if (res.success) load();
    else alert(res.message);
  }

  return (
    <AdminShell title="समाचार प्रबंधन">
      <div className="flex justify-end mb-6">
        <Link href="/admin/news/new" className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-lg text-sm">
          <Plus size={16} /> नया समाचार
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : (
        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          {items.length === 0 && <p className="p-6 text-sm text-muted">अभी तक कोई समाचार नहीं जोड़ा गया।</p>}
          <div className="divide-y divide-line">
            {items.map((post) => (
              <div key={post.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{post.title}</p>
                  <p className="text-xs text-muted mt-1">{post.category || "—"} • {new Date(post.createdAt).toLocaleDateString("hi-IN")}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-semibold rounded-full px-3 py-1 ${post.status === "PUBLISHED" ? "bg-primary-light text-primary-dark" : "bg-gray-100 text-gray-600"}`}>
                    {statusLabels[post.status]}
                  </span>
                  <Link href={`/admin/news/${post.id}`} aria-label="संपादित करें" className="p-2 rounded-lg hover:bg-primary-light text-primary">
                    <Pencil size={16} />
                  </Link>
                  {admin?.role === "ADMIN" && (
                    <button onClick={() => handleDelete(post.id)} aria-label="हटाएं" className="p-2 rounded-lg hover:bg-red-50 text-red-600">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

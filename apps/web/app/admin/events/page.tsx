"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Plus,
  Trash2,
  Pencil,
  CalendarDays,
  Image as ImageIcon,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { apiGet, apiDelete } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";

type EventMedia = {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
};

type Event = {
  id: string;
  title: string;
  slug: string;
  description: string;
  venue: string | null;
  eventDate: string;
  coverImage: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
  media: EventMedia[];
};

const statusLabels: Record<string, string> = {
  DRAFT: "ड्राफ्ट",
  PUBLISHED: "प्रकाशित",
  ARCHIVED: "संग्रहीत",
};

export default function AdminEventsPage() {
  const { admin } = useAdminAuth();

  const [items, setItems] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const res = await apiGet<Event[]>("/api/events/admin/all");

    if (res.success && res.data) {
      setItems(res.data);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (
      !confirm(
        "क्या आप वाकई इस कार्यक्रम को हटाना चाहते हैं?"
      )
    ) {
      return;
    }

    const res = await apiDelete(`/api/events/admin/${id}`);

    if (res.success) {
      load();
    } else {
      alert(res.message || "कार्यक्रम हटाने में विफल रहा।");
    }
  }

  return (
    <AdminShell title="कार्यक्रम प्रबंधन">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-ink">
            कार्यक्रम
          </h2>

          <p className="text-sm text-muted mt-1">
            कार्यक्रम जोड़ें और प्रबंधित करें।
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-lg text-sm"
        >
          <Plus size={16} />
          नया कार्यक्रम
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2
            className="animate-spin text-primary"
            size={28}
          />
        </div>
      ) : (
        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          {/* Empty */}
          {items.length === 0 && (
            <div className="p-10 text-center">
              <CalendarDays
                size={36}
                className="mx-auto text-muted mb-3"
              />

              <p className="text-sm text-muted">
                अभी तक कोई कार्यक्रम नहीं जोड़ा गया।
              </p>
            </div>
          )}

          {/* Events */}
          <div className="divide-y divide-line">
            {items.map((event) => (
              <div
                key={event.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5"
              >
                {/* Event information */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-ink truncate">
                      {event.title}
                    </p>

                    <span
                      className={`shrink-0 text-xs font-semibold rounded-full px-3 py-1 ${
                        event.status === "PUBLISHED"
                          ? "bg-primary-light text-primary-dark"
                          : event.status === "ARCHIVED"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {statusLabels[event.status]}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted">
                    <span>
                      📅{" "}
                      {new Date(event.eventDate).toLocaleDateString(
                        "hi-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>

                    {event.venue && (
                      <span>
                        📍 {event.venue}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1">
                      <ImageIcon size={13} />
                      {event.media?.length || 0} मीडिया
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/events/${event.id}`}
                    aria-label="संपादित करें"
                    className="p-2 rounded-lg hover:bg-primary-light text-primary"
                  >
                    <Pencil size={16} />
                  </Link>

                  {admin?.role === "ADMIN" && (
                    <button
                      onClick={() => handleDelete(event.id)}
                      aria-label="हटाएं"
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                    >
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
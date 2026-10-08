"use client";

import { useEffect, useState, use as usePromise } from "react";
import { Loader2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import EventForm from "@/components/admin/EventForm";
import { apiGet } from "@/lib/api";

type EventMedia = {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  publicId: string | null;
  sortOrder: number;
  caption: string | null;
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
  media: EventMedia[];
};

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = usePromise(params);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      setLoading(true);

      const res = await apiGet<Event[]>(
        "/api/events/admin/all?page=1&pageSize=100"
      );

      if (res.success && res.data) {
        const found = res.data.find((item) => item.id === id);
        setEvent(found || null);
      }

      setLoading(false);
    }

    loadEvent();
  }, [id]);

  return (
    <AdminShell title="कार्यक्रम संपादित करें">
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2
            className="animate-spin text-primary"
            size={28}
          />
        </div>
      ) : !event ? (
        <div className="bg-white border border-line rounded-2xl p-6">
          <p className="text-sm text-muted">
            कार्यक्रम नहीं मिला।
          </p>
        </div>
      ) : (
        <EventForm
          initial={{
            id: event.id,
            title: event.title,
            slug: event.slug,
            description: event.description,
            venue: event.venue || "",
            eventDate: event.eventDate,
            coverImage: event.coverImage || "",
            status: event.status,
            media: event.media.map((media) => ({
              id: media.id,
              type: media.type,
              url: media.url,
              publicId: media.publicId || undefined,
              sortOrder: media.sortOrder,
              caption: media.caption || undefined,
            })),
          }}
        />
      )}
    </AdminShell>
  );
}
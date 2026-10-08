import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";

export const metadata: Metadata = {
  title: "कार्यक्रम",
};

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

type EventsResponse = {
  success: boolean;
  data?: Event[];
  message?: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function getEvents(): Promise<Event[]> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  try {
    const response = await fetch(
      `${apiUrl}/api/events?page=1&pageSize=100`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const result: EventsResponse = await response.json();

    if (!result.success || !result.data) {
      return [];
    }

    return result.data;
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  const now = new Date();

  const upcoming = events
    .filter((event) => new Date(event.eventDate) >= now)
    .sort(
      (a, b) =>
        new Date(a.eventDate).getTime() -
        new Date(b.eventDate).getTime()
    );

  const past = events
    .filter((event) => new Date(event.eventDate) < now)
    .sort(
      (a, b) =>
        new Date(b.eventDate).getTime() -
        new Date(a.eventDate).getTime()
    );

  return (
    <main>
      <Header />

      <PageBanner
        eyebrow="कार्यक्रम"
        title="आगामी एवं पिछले कार्यक्रम"
        subtitle="जनसंवाद, शिविर, बैठकें और सार्वजनिक कार्यक्रमों की जानकारी।"
      />

      <section className="container-page py-12 md:py-16">
        {/* =====================================================
            UPCOMING EVENTS
        ====================================================== */}

        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 rounded-full bg-primary" />

          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
              आगामी कार्यक्रम
            </h2>

            <p className="text-sm text-muted mt-1">
              आने वाले कार्यक्रमों और जनसंपर्क गतिविधियों की जानकारी
            </p>
          </div>
        </div>

        {upcoming.length === 0 ? (
          <div className="border border-line bg-white rounded-2xl p-8 text-center mb-16">
            <Calendar
              size={32}
              className="mx-auto text-muted mb-3"
            />

            <p className="text-sm text-muted">
              फिलहाल कोई आगामी कार्यक्रम उपलब्ध नहीं है।
            </p>
          </div>
        ) : (
          <div className="space-y-5 mb-16">
            {upcoming.map((event) => {
              const image =
                event.coverImage ||
                event.media.find(
                  (media) => media.type === "IMAGE"
                )?.url;

              return (
                <article
                  key={event.id}
                  className="group bg-white border border-line rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* IMAGE */}
                    {image && (
                      <div className="md:w-[32%] lg:w-[28%] shrink-0">
                        <Link
                          href={`/events/${event.slug}`}
                          className="block h-56 md:h-full min-h-[220px] overflow-hidden bg-gray-100"
                        >
                          <img
                            src={image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                      </div>
                    )}

                    {/* CONTENT */}
                    <div
                      className={`flex-1 p-6 md:p-7 ${
                        image ? "" : "w-full"
                      }`}
                    >
                      {/* Status */}
                      <span className="inline-flex items-center text-xs font-semibold text-white bg-primary rounded-full px-3 py-1">
                        आगामी
                      </span>

                      {/* Title */}
                      <Link
                        href={`/events/${event.slug}`}
                        className="block"
                      >
                        <h3 className="font-display text-xl md:text-2xl font-bold text-ink mt-3 hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                      </Link>

                      {/* Date + Venue */}
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                        <p className="flex items-center gap-2 text-sm text-ink font-medium">
                          <Calendar
                            size={16}
                            className="text-primary shrink-0"
                          />

                          {formatDate(event.eventDate)}
                        </p>

                        {event.venue && (
                          <p className="flex items-center gap-2 text-sm text-muted">
                            <MapPin
                              size={16}
                              className="text-primary shrink-0"
                            />

                            {event.venue}
                          </p>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="border-t border-line my-5" />

                      {/* Description */}
                      <p className="text-sm md:text-base text-muted leading-7">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* =====================================================
            PAST EVENTS
        ====================================================== */}

        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 rounded-full bg-ink/20" />

          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
              पिछले कार्यक्रम
            </h2>

            <p className="text-sm text-muted mt-1">
              पहले आयोजित किए गए कार्यक्रमों की जानकारी
            </p>
          </div>
        </div>

        {past.length === 0 ? (
          <div className="border border-line bg-white rounded-2xl p-8 text-center">
            <Calendar
              size={32}
              className="mx-auto text-muted mb-3"
            />

            <p className="text-sm text-muted">
              अभी तक कोई पिछला कार्यक्रम उपलब्ध नहीं है।
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {past.map((event) => {
              const image =
                event.coverImage ||
                event.media.find(
                  (media) => media.type === "IMAGE"
                )?.url;

              return (
                <article
                  key={event.id}
                  className="group bg-white border border-line rounded-2xl overflow-hidden hover:border-primary/20 transition-colors"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* IMAGE */}
                    {image && (
                      <div className="md:w-[32%] lg:w-[28%] shrink-0">
                        <Link
                          href={`/events/${event.slug}`}
                          className="block h-56 md:h-full min-h-[220px] overflow-hidden bg-gray-100"
                        >
                          <img
                            src={image}
                            alt={event.title}
                            className="w-full h-full object-cover opacity-95 transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                      </div>
                    )}

                    {/* CONTENT */}
                    <div
                      className={`flex-1 p-6 md:p-7 ${
                        image ? "" : "w-full"
                      }`}
                    >
                      {/* Status */}
                      <span className="inline-flex items-center text-xs font-semibold text-muted bg-gray-100 rounded-full px-3 py-1">
                        पिछला कार्यक्रम
                      </span>

                      {/* Title */}
                      <Link
                        href={`/events/${event.slug}`}
                        className="block"
                      >
                        <h3 className="font-display text-xl md:text-2xl font-bold text-ink mt-3 hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                      </Link>

                      {/* Date + Venue */}
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                        <p className="flex items-center gap-2 text-sm text-ink font-medium">
                          <Calendar
                            size={16}
                            className="text-primary shrink-0"
                          />

                          {formatDate(event.eventDate)}
                        </p>

                        {event.venue && (
                          <p className="flex items-center gap-2 text-sm text-muted">
                            <MapPin
                              size={16}
                              className="text-primary shrink-0"
                            />

                            {event.venue}
                          </p>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="border-t border-line my-5" />

                      {/* Description */}
                      <p className="text-sm md:text-base text-muted leading-7">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
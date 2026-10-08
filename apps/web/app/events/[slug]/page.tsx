import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventMediaCarousel from "@/components/EventMediaCarousel";

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

type EventResponse = {
  success: boolean;
  data?: Event;
  message?: string;
};

async function getEvent(slug: string): Promise<Event | null> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  try {
    const response = await fetch(
      `${apiUrl}/api/events/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const result: EventResponse = await response.json();

    if (!result.success || !result.data) {
      return null;
    }

    return result.data;
  } catch {
    return null;
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("hi-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const decodedSlug = decodeURIComponent(slug);

  const event = await getEvent(decodedSlug);

  if (!event) {
    return {
      title: "कार्यक्रम",
    };
  }

  return {
    title: event.title,
    description: event.description.slice(0, 160),
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const decodedSlug = decodeURIComponent(slug);

  const event = await getEvent(decodedSlug);

  if (!event) {
    notFound();
  }

  const media: EventMedia[] =
    event.media && event.media.length > 0
      ? event.media
      : event.coverImage
        ? [
            {
              id: "cover-image",
              type: "IMAGE",
              url: event.coverImage,
              publicId: null,
              sortOrder: 0,
              caption: null,
            },
          ]
        : [];

  return (
    <main>
      <Header />

      <section className="bg-soft border-b border-line">
        <div className="container-page py-8 md:py-12">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors mb-6"
          >
            <ArrowLeft size={17} />
            सभी कार्यक्रम
          </Link>

          <div className="max-w-4xl">
            <span className="inline-flex text-xs font-semibold text-white bg-primary rounded-full px-3 py-1">
              कार्यक्रम
            </span>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ink leading-tight mt-4">
              {event.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-muted">
                <Calendar
                  size={18}
                  className="text-primary shrink-0"
                />

                <span>
                  {formatDate(event.eventDate)}
                  {" • "}
                  {formatTime(event.eventDate)}
                </span>
              </div>

              {event.venue && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <MapPin
                    size={18}
                    className="text-primary shrink-0"
                  />

                  <span>{event.venue}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="max-w-5xl mx-auto">
          {media.length > 0 && (
            <div className="mb-10">
              <EventMediaCarousel media={media} />
            </div>
          )}

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-1 h-8 bg-primary rounded-full" />

              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
                कार्यक्रम की जानकारी
              </h2>
            </div>

            <div className="text-muted text-base md:text-lg leading-8 whitespace-pre-line">
              {event.description}
            </div>
          </div>

          {event.venue && (
            <div className="mt-10 p-5 md:p-6 bg-soft border border-line rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin
                    size={20}
                    className="text-primary"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted">
                    कार्यक्रम स्थल
                  </p>

                  <p className="text-base md:text-lg font-semibold text-ink mt-1">
                    {event.venue}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-line">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              <ArrowLeft size={17} />
              सभी कार्यक्रम देखें
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
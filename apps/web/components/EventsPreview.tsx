import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";

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
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function getUpcomingEvents(): Promise<Event[]> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  try {
    const response = await fetch(
      `${apiUrl}/api/events?page=1&pageSize=20`,
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

    const now = new Date();

    return result.data
      .filter(
        (event) =>
          event.status === "PUBLISHED" &&
          new Date(event.eventDate) >= now
      )
      .sort(
        (a, b) =>
          new Date(a.eventDate).getTime() -
          new Date(b.eventDate).getTime()
      )
      .slice(0, 3);
  } catch {
    return [];
  }
}

export default async function EventsPreview() {
  const events = await getUpcomingEvents();

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="container-page py-12 md:py-16">
      <div className="flex items-end justify-between gap-4 mb-7">
        <div>
          <p className="text-sm font-semibold text-primary mb-1">
            कार्यक्रम
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
            आगामी कार्यक्रम
          </h2>
        </div>

        <Link
          href="/events"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          सभी कार्यक्रम
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {events.map((event) => {
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
              {image ? (
                <Link
                  href={`/events/${event.slug}`}
                  className="block aspect-[16/10] overflow-hidden bg-gray-100"
                >
                  <img
                    src={image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              ) : (
                <Link
                  href={`/events/${event.slug}`}
                  className="block"
                >
                  <div className="aspect-[16/10] bg-primary/5 flex items-center justify-center">
                    <ImageIcon
                      size={34}
                      className="text-primary/40"
                    />
                  </div>
                </Link>
              )}

              <div className="p-5">
                <span className="inline-flex text-xs font-semibold text-white bg-primary rounded-full px-3 py-1">
                  आगामी
                </span>

                <Link
                  href={`/events/${event.slug}`}
                  className="block"
                >
                  <h3 className="font-display text-lg font-bold text-ink mt-3 line-clamp-2 hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                </Link>

                <p className="flex items-center gap-2 text-xs text-ink font-medium mt-3">
                  <Calendar
                    size={14}
                    className="text-primary shrink-0"
                  />

                  {formatDate(event.eventDate)}
                </p>

                {event.venue && (
                  <p className="flex items-center gap-2 text-xs text-muted mt-2">
                    <MapPin
                      size={14}
                      className="text-primary shrink-0"
                    />

                    <span className="line-clamp-1">
                      {event.venue}
                    </span>
                  </p>
                )}

                <p className="text-sm text-muted leading-6 mt-3 line-clamp-2">
                  {event.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex justify-center mt-7 sm:hidden">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          सभी कार्यक्रम देखें
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
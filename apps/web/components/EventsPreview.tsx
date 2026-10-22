
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

function isUpcoming(date: string) {
  const eventDate = new Date(date);
  const today = new Date();

  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return eventDate >= today;
}

async function getUpcomingEvents(): Promise<Event[]> {
  const apiUrl = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
  ).replace(/\/+$/, "");

  try {
    const response = await fetch(
      `${apiUrl}/api/events?page=1&pageSize=100`,
      { cache: "no-store" }
    );

    if (!response.ok) return [];

    const result: EventsResponse = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      return [];
    }

    const publishedEvents = result.data.filter(
      (event) => event.status === "PUBLISHED"
    );

    const upcomingEvents = publishedEvents
      .filter((event) => isUpcoming(event.eventDate))
      .sort(
        (a, b) =>
          new Date(a.eventDate).getTime() -
          new Date(b.eventDate).getTime()
      );

    const pastEvents = publishedEvents
      .filter((event) => !isUpcoming(event.eventDate))
      .sort(
        (a, b) =>
          new Date(b.eventDate).getTime() -
          new Date(a.eventDate).getTime()
      );

    const upcomingToShow = upcomingEvents.slice(0, 3);
    const remainingSlots = 3 - upcomingToShow.length;

    return [
      ...upcomingToShow,
      ...pastEvents.slice(0, remainingSlots),
    ];
  } catch (error) {
    console.error("Failed to load events:", error);
    return [];
  }
}

export default async function EventsPreview() {
  const events = await getUpcomingEvents();

  const hasUpcomingEvents = events.some((event) =>
    isUpcoming(event.eventDate)
  );

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="container-page py-2 md:py-2">
      <div className="flex items-end justify-between gap-4 mb-7">
        <div>
          <p className="text-sm font-semibold text-primary mb-1">
            कार्यक्रम
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
            {hasUpcomingEvents ? "आगामी कार्यक्रम" : "कार्यक्रम"}
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

      <div className="grid items-stretch md:grid-cols-3 gap-6">
        {events.map((event) => {
          const image =
            event.coverImage ||
            event.media?.find((media) => media.type === "IMAGE")?.url;

          const upcoming = isUpcoming(event.eventDate);

          return (
            <article
              key={event.id}
              className="group h-full flex flex-col bg-white border border-line rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
            >
              <Link
                href={`/events/${event.slug}`}
                className="block aspect-[16/10] overflow-hidden bg-gray-100"
                aria-label={`${event.title} देखें`}
              >
                {image ? (
                  <img
                    src={image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5">
                    <ImageIcon
                      size={34}
                      className="text-primary/40"
                    />
                  </div>
                )}
              </Link>

              <div className="flex flex-1 flex-col p-5">
                <span
                  className={`inline-flex self-start text-xs font-semibold rounded-full px-3 py-1 ${
                    upcoming
                      ? "text-white bg-primary"
                      : "text-white bg-gray-600"
                  }`}
                >
                  {upcoming ? "आगामी" : "संपन्न"}
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

                <Link
                  href={`/events/${event.slug}`}
                  className="mt-auto pt-4 inline-flex items-center gap-2 self-start text-sm font-semibold text-primary hover:underline"
                >
                  और पढ़ें <ArrowRight size={14} />
                </Link>
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

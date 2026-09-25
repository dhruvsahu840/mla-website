import type { Metadata } from "next";
import { Calendar, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { events } from "@/lib/site-content";

export const metadata: Metadata = { title: "कार्यक्रम" };

export default function EventsPage() {
  const upcoming = events.filter((e) => e.upcoming);
  const past = events.filter((e) => !e.upcoming);

  return (
    <main>
      <Header />
      <PageBanner eyebrow="कार्यक्रम" title="आगामी एवं पिछले कार्यक्रम" subtitle="जनसंवाद, शिविर, बैठकें और सार्वजनिक कार्यक्रमों की जानकारी।" />

      <section className="container-page py-12 md:py-16">
        <h2 className="font-display text-2xl font-bold text-ink mb-6">आगामी कार्यक्रम</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {upcoming.map((event) => (
            <article key={event.slug} className="border border-primary/20 bg-primary-light rounded-2xl p-5">
              <span className="text-xs font-semibold text-white bg-primary rounded-full px-3 py-1">आगामी</span>
              <h3 className="font-display font-bold text-ink mt-3">{event.title}</h3>
              <p className="text-sm text-muted mt-2">{event.description}</p>
              <div className="mt-4 space-y-1.5">
                <p className="flex items-center gap-2 text-xs text-ink font-medium">
                  <Calendar size={13} className="text-primary" /> {event.date}
                </p>
                <p className="flex items-center gap-2 text-xs text-muted">
                  <MapPin size={13} className="text-primary" /> {event.venue}
                </p>
              </div>
            </article>
          ))}
        </div>

        <h2 className="font-display text-2xl font-bold text-ink mb-6">पिछले कार्यक्रम</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {past.map((event) => (
            <article key={event.slug} className="border border-line bg-white rounded-2xl p-5 opacity-90">
              <h3 className="font-display font-bold text-ink">{event.title}</h3>
              <p className="text-sm text-muted mt-2">{event.description}</p>
              <div className="mt-4 space-y-1.5">
                <p className="flex items-center gap-2 text-xs text-ink font-medium">
                  <Calendar size={13} className="text-primary" /> {event.date}
                </p>
                <p className="flex items-center gap-2 text-xs text-muted">
                  <MapPin size={13} className="text-primary" /> {event.venue}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}

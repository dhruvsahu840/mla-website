import type { Metadata } from "next";
import { MapPin, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import StatusBadge from "@/components/StatusBadge";
import Placeholder from "@/components/Placeholder";
import { developmentWorks } from "@/lib/site-content";

export const metadata: Metadata = { title: "विकास कार्य" };

const variants = ["roadwork", "plantation", "meeting", "roadwork", "meeting", "plantation"] as const;

export default function DevelopmentWorksPage() {
  return (
    <main>
      <Header />
      <PageBanner
        eyebrow="विकास कार्य"
        title="क्षेत्र में विकास की पहल"
        subtitle="सड़क, पानी, बिजली, शिक्षा, स्वास्थ्य और स्वच्छता से जुड़े कार्यों की जानकारी, स्थिति सहित।"
      />

      <section className="container-page py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developmentWorks.map((work, i) => (
            <article key={work.slug} className="border border-line rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow">
              <Placeholder label={work.category} variant={variants[i % variants.length]} className="w-full aspect-video" />
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-primary bg-primary-light rounded-full px-3 py-1">{work.category}</span>
                  <StatusBadge status={work.status} />
                </div>
                <h3 className="font-display font-bold text-ink mt-3 leading-snug">{work.title}</h3>
                <p className="text-sm text-muted mt-2 line-clamp-3">{work.description}</p>
                <div className="mt-4 space-y-1.5">
                  <p className="flex items-center gap-2 text-xs text-muted">
                    <MapPin size={13} className="text-primary shrink-0" /> {work.location}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-muted">
                    <Calendar size={13} className="text-primary shrink-0" /> {work.startDate}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}

import type { Metadata } from "next";
import { Images } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import Placeholder from "@/components/Placeholder";
import { galleryAlbums } from "@/lib/site-content";

export const metadata: Metadata = { title: "फोटो गैलरी" };

const variants = ["meeting", "plantation", "handshake", "landscape", "roadwork", "meeting"] as const;

export default function GalleryPage() {
  return (
    <main>
      <Header />
      <PageBanner eyebrow="गैलरी" title="फोटो गैलरी" subtitle="कार्यक्रमों, उद्घाटन समारोहों और जनसंपर्क गतिविधियों की झलकियां।" />

      <section className="container-page py-12 md:py-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryAlbums.map((album, i) => (
            <div key={album.slug} className="border border-line rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow">
              <Placeholder label={album.title} variant={variants[i % variants.length]} className="w-full aspect-[4/3]" />
              <div className="p-4">
                <h3 className="font-display font-bold text-ink text-sm">{album.title}</h3>
                <p className="flex items-center gap-1.5 text-xs text-muted mt-1.5">
                  <Images size={12} /> {album.count} तस्वीरें • {album.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}

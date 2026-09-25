import Link from "next/link";
import Placeholder from "./Placeholder";
import { galleryPreview } from "@/lib/site-content";

const variants = ["meeting", "plantation", "handshake", "landscape", "roadwork"] as const;

export default function GalleryPreview() {
  return (
    <section className="container-page py-16 md:py-24">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-8">फोटो गैलरी</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {galleryPreview.map((label, i) => (
          <Placeholder key={i} label={label} variant={variants[i % variants.length]} className="aspect-square rounded-xl" />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Link
          href="/gallery"
          className="border border-line hover:border-primary text-ink font-semibold px-6 py-2.5 rounded-full transition-colors text-sm"
        >
          और देखें →
        </Link>
      </div>
    </section>
  );
}


import Link from "next/link";
import { Images } from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
).replace(/\/$/, "");

type GalleryPhoto = {
  id: string;
  url: string;
  caption?: string | null;
  album?: {
    title?: string;
    slug?: string;
  };
};

async function getLatestPhotos(): Promise<GalleryPhoto[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/gallery/latest?limit=10`,
      { cache: "no-store" }
    );

    if (!response.ok) return [];

    const result = await response.json();

    return Array.isArray(result.data)
      ? result.data
      : Array.isArray(result)
        ? result
        : [];
  } catch (error) {
    console.error("Failed to load homepage gallery:", error);
    return [];
  }
}

export default async function GalleryPreview() {
  const photos = await getLatestPhotos();

  return (
    <section className="container-page py-16 md:py-24">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">
          फोटो गैलरी
        </h2>

        <Link
          href="/gallery"
          className="text-sm font-semibold text-primary hover:underline"
        >
          सभी तस्वीरें →
        </Link>
      </div>

      {photos.length === 0 ? (
        <div className="rounded-2xl border border-line px-6 py-12 text-center">
          <Images size={32} className="mx-auto mb-3 text-muted" />
          <p className="text-sm text-muted">
            अभी कोई फोटो उपलब्ध नहीं है।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {photos.slice(0, 10).map((photo) => (
            <Link
              key={photo.id}
              href="/gallery"
              className="group overflow-hidden rounded-xl border border-line bg-white"
              aria-label={`फोटो गैलरी देखें: ${
                photo.caption || photo.album?.title || "तस्वीर"
              }`}
            >
              <div className="flex aspect-square items-center justify-center overflow-hidden bg-gray-50 p-2">
                <img
                  src={photo.url}
                  alt={
                    photo.caption ||
                    photo.album?.title ||
                    "गैलरी तस्वीर"
                  }
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {(photo.caption || photo.album?.title) && (
                <p className="truncate px-2 py-2 text-xs font-medium text-ink">
                  {photo.caption || photo.album?.title}
                </p>
              )}
            </Link> 
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Link
          href="/gallery"
          className="rounded-full border border-line px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary"
        >
          और देखें →
        </Link>
      </div>
    </section>
  );
}


"use client";

import { useEffect, useState } from "react";
import type { Metadata } from "next";
import {
  Images,
  CalendarDays,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";

type GalleryPhoto = {
  id: string;
  url: string;
};

type GalleryAlbum = {
  id: string;
  title: string;
  slug: string;
  coverImage?: string | null;
  createdAt?: string;
  items?: GalleryPhoto[];
  _count?: { items: number };
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
).replace(/\/$/, "");

function formatDate(date?: string) {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhotos, setActivePhotos] = useState<GalleryPhoto[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/api/gallery/albums`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to load gallery");
        return response.json();
      })
      .then((result) => {
        const data = Array.isArray(result) ? result : result.data;
        setAlbums(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error("Gallery error:", error))
      .finally(() => setLoading(false));
  }, []);

  function openViewer(photos: GalleryPhoto[], index: number) {
    setActivePhotos(photos);
    setActiveIndex(index);
  }

  function closeViewer() {
    setActivePhotos([]);
    setActiveIndex(0);
  }

  function previousPhoto() {
    setActiveIndex((index) =>
      index === 0 ? activePhotos.length - 1 : index - 1
    );
  }

  function nextPhoto() {
    setActiveIndex((index) =>
      index === activePhotos.length - 1 ? 0 : index + 1
    );
  }

  useEffect(() => {
    if (activePhotos.length === 0) return;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft") previousPhoto();
      if (event.key === "ArrowRight") nextPhoto();
    }

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [activePhotos, activeIndex]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <PageBanner
        eyebrow="गैलरी"
        title="फोटो गैलरी"
        subtitle="कार्यक्रमों, उद्घाटन समारोहों और जनसंपर्क गतिविधियों की झलकियां।"
      />

      <section className="container-page py-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-ink md:text-2xl">
              फोटो गैलरी
            </h2>
            <span className="text-sm text-muted">
              {albums.length} एल्बम
            </span>
          </div>

          {loading ? (
            <p className="py-12 text-center text-muted">
              तस्वीरें लोड हो रही हैं...
            </p>
          ) : albums.length === 0 ? (
            <div className="rounded-xl border border-line bg-white py-16 text-center">
              <Images className="mx-auto mb-3 text-gray-400" size={40} />
              <p className="font-semibold text-ink">
                अभी कोई फोटो उपलब्ध नहीं है
              </p>
            </div>
          ) : (
            <div className="space-y-7">
              {albums.map((album) => {
                const photos =
                  album.items && album.items.length > 0
                    ? album.items
                    : album.coverImage
                      ? [{ id: `${album.id}-cover`, url: album.coverImage }]
                      : [];

                const count = album._count?.items ?? photos.length;

                return (
                  <article
                    key={album.id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-3 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Images size={20} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-display font-bold text-ink">
                          {album.title}
                        </h3>
                        <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                          {album.createdAt && (
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays size={13} />
                              {formatDate(album.createdAt)}
                            </span>
                          )}
                          <span>{count} तस्वीरें</span>
                        </p>
                      </div>
                    </div>

                    {/* Five thumbnails per row on desktop */}
                    <div className="grid grid-cols-3 gap-1 p-1 sm:grid-cols-4 md:grid-cols-5">
                      {photos.map((photo, index) => (
                        <button
                          key={photo.id}
                          type="button"
                          onClick={() => openViewer(photos, index)}
                          aria-label={`${album.title}, फोटो ${index + 1} खोलें`}
                          className="group relative aspect-square overflow-hidden bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <img
                            src={photo.url}
                            alt={`${album.title} - ${index + 1}`}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                        </button>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Full-screen photo carousel */}
      {activePhotos.length > 0 && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={closeViewer}
        >
          <button
            type="button"
            onClick={closeViewer}
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X size={26} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              previousPhoto();
            }}
            aria-label="Previous photo"
            className="absolute left-2 z-10 rounded-full bg-white/15 p-2 text-white hover:bg-white/30 sm:left-6 sm:p-3"
          >
            <ChevronLeft size={28} />
          </button>

          <div
            className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              key={activePhotos[activeIndex].id}
              src={activePhotos[activeIndex].url}
              alt={`Photo ${activeIndex + 1}`}
              className="max-h-[82vh] max-w-full object-contain"
            />
            <p className="text-sm text-white/80">
              {activeIndex + 1} / {activePhotos.length}
            </p>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              nextPhoto();
            }}
            aria-label="Next photo"
            className="absolute right-2 z-10 rounded-full bg-white/15 p-2 text-white hover:bg-white/30 sm:right-6 sm:p-3"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      <Footer />
    </main>
  );
}

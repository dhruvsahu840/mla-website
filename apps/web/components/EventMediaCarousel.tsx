"use client";

import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
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

type Props = {
  media: EventMedia[];
};

export default function EventMediaCarousel({ media }: Props) {
  const [current, setCurrent] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  if (!media.length) {
    return (
      <div className="aspect-[16/9] bg-primary/5 rounded-2xl flex items-center justify-center">
        <ImageIcon
          size={48}
          className="text-primary/30"
        />
      </div>
    );
  }

  const activeMedia = media[current];

  function previous() {
    setCurrent((prev) =>
      prev === 0 ? media.length - 1 : prev - 1
    );
  }

  function next() {
    setCurrent((prev) =>
      prev === media.length - 1 ? 0 : prev + 1
    );
  }

  function handleTouchStart(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchMove(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    touchEndX.current = event.touches[0].clientX;
  }

  function handleTouchEnd() {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const distance =
      touchStartX.current - touchEndX.current;

    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        next();
      } else {
        previous();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-2xl bg-black"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="aspect-[16/9] md:aspect-[16/8]">
          {activeMedia.type === "VIDEO" ? (
            <video
              key={activeMedia.id}
              src={activeMedia.url}
              controls
              playsInline
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <img
              key={activeMedia.id}
              src={activeMedia.url}
              alt={
                activeMedia.caption ||
                "कार्यक्रम की तस्वीर"
              }
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={previous}
              aria-label="पिछली तस्वीर"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="अगली तस्वीर"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronRight size={22} />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/45">
              {media.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`मीडिया ${index + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    index === current
                      ? "w-6 bg-white"
                      : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {activeMedia.caption && (
        <p className="text-sm text-muted text-center mt-3">
          {activeMedia.caption}
        </p>
      )}

      {media.length > 1 && (
        <p className="text-xs text-muted text-center mt-2">
          {current + 1} / {media.length}
        </p>
      )}
    </div>
  );
}
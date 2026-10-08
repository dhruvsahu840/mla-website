"use client";

import { useRef, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Save,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { apiPost, apiPut } from "@/lib/api";

type EventStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

type EventMedia = {
  id?: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  publicId?: string;
  sortOrder?: number;
  caption?: string;
};

type EventFormValues = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  venue: string;
  eventDate: string;
  coverImage: string;
  status: EventStatus;
  media: EventMedia[];
};

type UploadingFile = {
  id: string;
  name: string;
  type: "IMAGE" | "VIDEO";
  progress: "uploading" | "done" | "error";
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0900-\u097F-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 100);
}

export default function EventForm({
  initial,
}: {
  initial?: EventFormValues;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isEdit = Boolean(initial?.id);

  const [values, setValues] = useState<EventFormValues>(
    initial || {
      title: "",
      slug: "",
      description: "",
      venue: "",
      eventDate: "",
      coverImage: "",
      status: "DRAFT",
      media: [],
    }
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function update<K extends keyof EventFormValues>(
    key: K,
    value: EventFormValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function uploadFile(file: File) {
    const uploadId = `${Date.now()}-${Math.random()}`;

    const mediaType: "IMAGE" | "VIDEO" = file.type.startsWith("video/")
      ? "VIDEO"
      : "IMAGE";

    setUploadingFiles((current) => [
      ...current,
      {
        id: uploadId,
        name: file.name,
        type: mediaType,
        progress: "uploading",
      },
    ]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/media/upload`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(result.message || "File upload failed");
      }

      const uploadedMedia: EventMedia = {
        type: result.data.type,
        url: result.data.url,
        publicId: result.data.publicId,
        sortOrder: values.media.length,
      };

      setValues((current) => ({
        ...current,
        media: [
          ...current.media,
          {
            ...uploadedMedia,
            sortOrder: current.media.length,
          },
        ],
      }));

      setUploadingFiles((current) =>
        current.map((item) =>
          item.id === uploadId
            ? {
                ...item,
                progress: "done",
              }
            : item
        )
      );
    } catch (err) {
      setUploadingFiles((current) =>
        current.map((item) =>
          item.id === uploadId
            ? {
                ...item,
                progress: "error",
              }
            : item
        )
      );

      throw err;
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    setError("");

    const selectedFiles = Array.from(files);

    const invalidFile = selectedFiles.find(
      (file) =>
        !file.type.startsWith("image/") &&
        !file.type.startsWith("video/")
    );

    if (invalidFile) {
      setError("केवल image और video files upload कर सकते हैं।");
      return;
    }

    try {
      for (const file of selectedFiles) {
        await uploadFile(file);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Media upload failed."
      );
    }
  }

  function removeMedia(index: number) {
    setValues((current) => {
      const media = current.media.filter((_, i) => i !== index);

      return {
        ...current,
        media: media.map((item, i) => ({
          ...item,
          sortOrder: i,
        })),
      };
    });
  }

  function moveMedia(index: number, direction: "left" | "right") {
    setValues((current) => {
      const media = [...current.media];

      const newIndex =
        direction === "left" ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= media.length) {
        return current;
      }

      [media[index], media[newIndex]] = [
        media[newIndex],
        media[index],
      ];

      return {
        ...current,
        media: media.map((item, i) => ({
          ...item,
          sortOrder: i,
        })),
      };
    });
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDrop(index: number) {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      return;
    }

    setValues((current) => {
      const media = [...current.media];

      const [movedItem] = media.splice(dragIndex, 1);

      media.splice(index, 0, movedItem);

      return {
        ...current,
        media: media.map((item, i) => ({
          ...item,
          sortOrder: i,
        })),
      };
    });

    setDragIndex(null);
  }

  function formatDateForInput(date: string) {
    if (!date) {
      return "";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date.slice(0, 16);
    }

    const offset = parsed.getTimezoneOffset();

    const localDate = new Date(
      parsed.getTime() - offset * 60 * 1000
    );

    return localDate.toISOString().slice(0, 16);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setSubmitting(true);
    setError("");

    if (uploadingFiles.some((file) => file.progress === "uploading")) {
      setError("Please wait until all media uploads finish.");
      setSubmitting(false);
      return;
    }

    if (!values.title.trim()) {
      setError("Title is required.");
      setSubmitting(false);
      return;
    }

    if (!values.description.trim()) {
      setError("Description is required.");
      setSubmitting(false);
      return;
    }

    if (!values.eventDate) {
      setError("Event date and time is required.");
      setSubmitting(false);
      return;
    }

    const payload = {
      title: values.title.trim(),
      slug: values.slug.trim() || slugify(values.title),
      description: values.description.trim(),
      venue: values.venue.trim() || undefined,
      eventDate: new Date(values.eventDate).toISOString(),
      coverImage: values.coverImage.trim() || undefined,
      status: values.status,
      media: values.media.map((item, index) => ({
        type: item.type,
        url: item.url,
        publicId: item.publicId,
        sortOrder: index,
        caption: item.caption,
      })),
    };

    try {
      const response = isEdit
        ? await apiPut(
            `/api/events/admin/${initial!.id}`,
            payload
          )
        : await apiPost("/api/events", payload);

      if (response.success) {
        router.push("/admin/events");
        router.refresh();
      } else {
        setError(
          response.message || "Event save failed."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Event save failed."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-line rounded-2xl p-6 space-y-6 max-w-3xl"
    >
      {/* Title */}
      <div>
        <label
          htmlFor="event-title"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          कार्यक्रम का शीर्षक *
        </label>

        <input
          id="event-title"
          required
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          onBlur={() => {
            if (!values.slug) {
              update("slug", slugify(values.title));
            }
          }}
          placeholder="जैसे: जनसभा एवं विकास कार्यक्रम"
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary"
        />
      </div>

      {/* Slug */}
      <div>
        <label
          htmlFor="event-slug"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          Slug *
        </label>

        <input
          id="event-slug"
          required
          value={values.slug}
          onChange={(e) =>
            update("slug", slugify(e.target.value))
          }
          placeholder="jan-sabha-vikas-karyakram"
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary"
        />

        <p className="text-xs text-muted mt-1.5">
          यह event के URL में इस्तेमाल होगा।
        </p>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="event-description"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          पूर्ण विवरण *
        </label>

        <textarea
          id="event-description"
          required
          rows={7}
          value={values.description}
          onChange={(e) =>
            update("description", e.target.value)
          }
          placeholder="कार्यक्रम के बारे में पूरी जानकारी..."
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary"
        />
      </div>

      {/* Venue */}
      <div>
        <label
          htmlFor="event-venue"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          स्थान
        </label>

        <input
          id="event-venue"
          value={values.venue}
          onChange={(e) => update("venue", e.target.value)}
          placeholder="जैसे: बिजावर, छतरपुर"
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary"
        />
      </div>

      {/* Event Date */}
      <div>
        <label
          htmlFor="event-date"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          कार्यक्रम की तारीख और समय *
        </label>

        <input
          id="event-date"
          type="datetime-local"
          required
          value={formatDateForInput(values.eventDate)}
          onChange={(e) =>
            update("eventDate", e.target.value)
          }
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary"
        />

        <p className="text-xs text-muted mt-1.5">
          इसी तारीख के आधार पर public page पर upcoming/past event
          दिखाया जाएगा।
        </p>
      </div>

      {/* Cover Image */}
      <div>
        <label
          htmlFor="event-cover"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          Cover Image URL
        </label>

        <input
          id="event-cover"
          type="url"
          value={values.coverImage}
          onChange={(e) =>
            update("coverImage", e.target.value)
          }
          placeholder="https://..."
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary"
        />

        <p className="text-xs text-muted mt-1.5">
          Optional. Media में upload की गई पहली image को बाद में
          cover के रूप में भी इस्तेमाल किया जा सकता है।
        </p>
      </div>

      {/* Media Upload */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <label className="block text-sm font-semibold text-ink">
              Event Media
            </label>

            <p className="text-xs text-muted mt-1">
              Multiple images और videos upload कर सकते हैं।
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={submitting}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-lg text-sm"
          >
            <Upload size={16} />
            Media जोड़ें
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            hidden
            onChange={(e) => {
              handleFiles(e.target.files);

              // Allows selecting the same file again.
              e.currentTarget.value = "";
            }}
          />
        </div>

        {/* Uploading files */}
        {uploadingFiles.length > 0 && (
          <div className="space-y-2 mb-4">
            {uploadingFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border border-line bg-gray-50 px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {file.type === "IMAGE" ? (
                    <ImageIcon size={16} />
                  ) : (
                    <Video size={16} />
                  )}

                  <span className="text-sm truncate">
                    {file.name}
                  </span>
                </div>

                <div className="text-xs">
                  {file.progress === "uploading" && (
                    <span className="text-muted flex items-center gap-1">
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                      Uploading...
                    </span>
                  )}

                  {file.progress === "done" && (
                    <span className="text-green-700">
                      Uploaded
                    </span>
                  )}

                  {file.progress === "error" && (
                    <span className="text-red-700">
                      Failed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Media preview */}
        {values.media.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {values.media.map((media, index) => (
              <div
                key={`${media.url}-${index}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                className="relative group border border-line rounded-xl overflow-hidden bg-gray-50"
              >
                {/* Media */}
                <div className="aspect-square bg-gray-100">
                  {media.type === "IMAGE" ? (
                    <img
                      src={media.url}
                      alt={`Event media ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={media.url}
                      controls
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Number */}
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </div>

                {/* Type */}
                <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-[10px] font-semibold flex items-center gap-1">
                  {media.type === "IMAGE" ? (
                    <>
                      <ImageIcon size={11} />
                      IMAGE
                    </>
                  ) : (
                    <>
                      <Video size={11} />
                      VIDEO
                    </>
                  )}
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove media"
                >
                  <X size={16} />
                </button>

                {/* Reorder */}
                <div className="absolute bottom-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() =>
                      moveMedia(index, "left")
                    }
                    className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center disabled:opacity-40"
                    aria-label="Move left"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    type="button"
                    disabled={
                      index === values.media.length - 1
                    }
                    onClick={() =>
                      moveMedia(index, "right")
                    }
                    className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center disabled:opacity-40"
                    aria-label="Move right"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-line rounded-xl p-8 text-center">
            <div className="flex justify-center mb-3">
              <Upload
                size={28}
                className="text-muted"
              />
            </div>

            <p className="text-sm text-muted">
              अभी कोई media नहीं जोड़ा गया।
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-primary font-semibold mt-2"
            >
              Images या videos चुनें
            </button>
          </div>
        )}

        {values.media.length > 1 && (
          <p className="text-xs text-muted mt-2">
            Tip: Media को drag करके order बदल सकते हैं, या
            arrows का इस्तेमाल करें।
          </p>
        )}
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="event-status"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          स्थिति
        </label>

        <select
          id="event-status"
          value={values.status}
          onChange={(e) =>
            update(
              "status",
              e.target.value as EventStatus
            )
          }
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm bg-white"
        >
          <option value="DRAFT">ड्राफ्ट</option>
          <option value="PUBLISHED">प्रकाशित करें</option>
          <option value="ARCHIVED">संग्रहीत करें</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <p
          role="alert"
          className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5"
        >
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={
          submitting ||
          uploadingFiles.some(
            (file) => file.progress === "uploading"
          )
        }
        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
      >
        {submitting ? (
          <Loader2
            className="animate-spin"
            size={16}
          />
        ) : (
          <Save size={16} />
        )}

        {isEdit ? "सहेजें" : "कार्यक्रम सहेजें"}
      </button>
    </form>
  );
}

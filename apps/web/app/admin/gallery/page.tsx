
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Images,
  Plus,
  Upload,
  Trash2,
  Loader2,
  RefreshCw,
  ImagePlus,
  X,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { apiGet, apiPost, apiDelete } from "@/lib/api";

type GalleryItem = {
  id: string;
  albumId: string;
  url: string;
  type: string;
  caption?: string | null;
  createdAt: string;
};

type GalleryAlbum = {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  coverImage?: string | null;
  createdAt: string;
  items: GalleryItem[];
  _count?: { items: number };
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);
}

export default function AdminGalleryPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const activeAlbum =
    albums.find((album) => album.id === selectedAlbum) ?? null;

  const loadAlbums = useCallback(async (preferredId?: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await apiGet<GalleryAlbum[]>(
        "/api/gallery/albums"
      );

      if (!response.success) {
        throw new Error(response.message || "Albums load nahi ho paaye.");
      }

      const list = response.data ?? [];
      setAlbums(list);

      setSelectedAlbum((current) => {
        const wanted = preferredId || current;
        return list.some((album) => album.id === wanted)
          ? wanted
          : list[0]?.id ?? "";
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gallery load nahi hui."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAlbums();
  }, [loadAlbums]);

  async function createAlbum(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) return;

    setCreating(true);
    setError("");
    setNotice("");

    try {
      const slug = makeSlug(title);

      if (!slug) {
        throw new Error("Please enter a valid album title.");
      }

      const response = await apiPost<GalleryAlbum>(
        "/api/gallery/albums",
        {
          title: title.trim(),
          slug,
          category: category.trim() || undefined,
        }
      );

      if (!response.success || !response.data?.id) {
        throw new Error(response.message || "Album create nahi hua.");
      }

      setTitle("");
      setCategory("");
      setShowCreateForm(false);
      setNotice("Album successfully create ho gaya.");

      await loadAlbums(response.data.id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Album create nahi hua."
      );
    } finally {
      setCreating(false);
    }
  }

  async function uploadPhotos(files: FileList | null) {
    if (!files?.length) return;

    if (!selectedAlbum) {
      setError("Pehle ek album create ya select karo.");
      return;
    }

    const selectedFiles = Array.from(files);
    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFile) {
      setError("Gallery mein sirf image files upload kar sakte ho.");
      return;
    }

    setUploading(true);
    setError("");
    setNotice("");

    let uploadedCount = 0;

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        // Upload the image to the existing Cloudinary API.
        const uploadResponse = await fetch(
          `${API_URL}/api/media/upload`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );

        const uploadResult = await uploadResponse.json();

        if (
          !uploadResponse.ok ||
          !uploadResult.success ||
          !uploadResult.data?.url
        ) {
          throw new Error(
            uploadResult.message || `Upload failed: ${file.name}`
          );
        }

        // Save the Cloudinary URL against the selected album.
        const saveResponse = await apiPost<GalleryItem>(
          `/api/gallery/albums/${selectedAlbum}/items`,
          {
            url: uploadResult.data.url,
            caption: file.name.replace(/\.[^.]+$/, ""),
          }
        );

        if (!saveResponse.success) {
          throw new Error(
            saveResponse.message ||
              `Image database mein save nahi hui: ${file.name}`
          );
        }

        uploadedCount++;
      }

      setNotice(`${uploadedCount} photo(s) successfully upload ho gayi.`);
      await loadAlbums(selectedAlbum);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Photo upload failed."
      );

      // Refresh in case some photos succeeded before an error occurred.
      await loadAlbums(selectedAlbum);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function deletePhoto(item: GalleryItem) {
    if (!window.confirm("Kya tum is photo ko delete karna chahte ho?")) {
      return;
    }

    setDeletingId(item.id);
    setError("");
    setNotice("");

    try {
      const response = await apiDelete(
        `/api/gallery/items/${item.id}`
      );

      if (!response.success) {
        throw new Error(response.message || "Photo delete nahi hui.");
      }

      setNotice("Photo delete ho gayi.");
      await loadAlbums(selectedAlbum);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Photo delete nahi hui."
      );
    } finally {
      setDeletingId("");
    }
  }

  async function deleteAlbum(album: GalleryAlbum) {
    if (
      !window.confirm(
        `Album "${album.title}" aur uski saari gallery entries delete karni hain?`
      )
    ) {
      return;
    }

    setDeletingId(album.id);
    setError("");
    setNotice("");

    try {
      const response = await apiDelete(
        `/api/gallery/albums/${album.id}`
      );

      if (!response.success) {
        throw new Error(response.message || "Album delete nahi hua.");
      }

      setNotice("Album delete ho gaya.");
      await loadAlbums();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Album delete nahi hua."
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <AdminShell title="Gallery Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Images className="text-primary" size={25} />
              <h1 className="text-2xl font-bold text-ink">
                Gallery Management
              </h1>
            </div>
            <p className="text-sm text-muted mt-1">
              Albums aur public website ki photos yahan manage karo.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void loadAlbums(selectedAlbum)}
              disabled={loading || uploading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => setShowCreateForm((value) => !value)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              {showCreateForm ? <X size={17} /> : <Plus size={17} />}
              {showCreateForm ? "Cancel" : "Create Album"}
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            {notice}
          </div>
        )}

        {showCreateForm && (
          <form
            onSubmit={createAlbum}
            className="max-w-2xl space-y-4 rounded-2xl border border-line bg-white p-5"
          >
            <h2 className="font-bold text-ink">Create New Album</h2>

            <div>
              <label
                htmlFor="gallery-title"
                className="mb-1.5 block text-sm font-semibold"
              >
                Album title *
              </label>
              <input
                id="gallery-title"
                required
                maxLength={150}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="जैसे: विकास कार्य 2026"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
              <p className="mt-1 text-xs text-muted">
                URL slug: {makeSlug(title) || "album-title"}
              </p>
            </div>

            <div>
              <label
                htmlFor="gallery-category"
                className="mb-1.5 block text-sm font-semibold"
              >
                Category (optional)
              </label>
              <input
                id="gallery-category"
                maxLength={100}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="जैसे: जनसंपर्क, विकास कार्य, कार्यक्रम"
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={creating || !title.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {creating && <Loader2 size={16} className="animate-spin" />}
              {creating ? "Creating..." : "Create Album"}
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-line bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold text-ink">Albums</h2>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold">
                {albums.length}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 py-8 text-sm text-muted">
                <Loader2 size={17} className="animate-spin" />
                Loading albums...
              </div>
            ) : albums.length === 0 ? (
              <div className="py-8 text-center">
                <Images className="mx-auto mb-2 text-muted" size={30} />
                <p className="text-sm text-muted">Abhi koi album nahi hai.</p>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(true)}
                  className="mt-3 text-sm font-semibold text-primary"
                >
                  Pehla album banao
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {albums.map((album) => (
                  <button
                    type="button"
                    key={album.id}
                    onClick={() => setSelectedAlbum(album.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition ${
                      selectedAlbum === album.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:bg-gray-50"
                    }`}
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {album.coverImage ? (
                        <img
                          src={album.coverImage}
                          alt={album.title}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted">
                          <Images size={21} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">
                        {album.title}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {album._count?.items ?? album.items?.length ?? 0} photos
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </aside>

          <section className="min-w-0 rounded-2xl border border-line bg-white p-4 sm:p-5">
            {!activeAlbum ? (
              <div className="py-14 text-center">
                <ImagePlus className="mx-auto mb-3 text-muted" size={38} />
                <p className="font-semibold text-ink">Select an album</p>
                <p className="mt-1 text-sm text-muted">
                  Photos upload karne ke liye pehle album create karo.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="break-words text-xl font-bold text-ink">
                      {activeAlbum.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      {activeAlbum.category || "Uncategorized"} ·{" "}
                      {activeAlbum.items?.length ?? 0} photos
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {uploading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      {uploading ? "Uploading..." : "Upload Photos"}
                    </button>

                    <button
                      type="button"
                      onClick={() => void deleteAlbum(activeAlbum)}
                      disabled={deletingId === activeAlbum.id || uploading}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                    >
                      {deletingId === activeAlbum.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      Delete Album
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => {
                      void uploadPhotos(e.currentTarget.files);
                    }}
                  />
                </div>

                {uploading && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm text-muted">
                    <Loader2 size={17} className="animate-spin" />
                    Photos upload aur save ho rahi hain. Page open rakho...
                  </div>
                )}

                {activeAlbum.items?.length ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                    {activeAlbum.items.map((item) => (
                      <div
                        key={item.id}
                        className="group overflow-hidden rounded-xl border border-line bg-white"
                      >
                        <div className="flex min-h-36 items-center justify-center bg-gray-50">
                          <img
                            src={item.url}
                            alt={item.caption || activeAlbum.title}
                            loading="lazy"
                            className="max-h-64 w-full object-contain"
                          />
                        </div>

                        <div className="flex items-center justify-between gap-2 p-2.5">
                          <p className="min-w-0 truncate text-xs text-muted">
                            {item.caption || "Gallery photo"}
                          </p>
                          <button
                            type="button"
                            onClick={() => void deletePhoto(item)}
                            disabled={deletingId === item.id || uploading}
                            title="Delete photo"
                            aria-label="Delete photo"
                            className="shrink-0 rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === item.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-line py-14 text-center">
                    <ImagePlus
                      className="mx-auto mb-3 text-muted"
                      size={38}
                    />
                    <p className="font-semibold text-ink">
                      Is album mein abhi photos nahi hain
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Upload Photos par click karke images add karo.
                    </p>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}

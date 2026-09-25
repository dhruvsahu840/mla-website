"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { apiPost, apiPut } from "@/lib/api";

type PostFormValues = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  coverImage: string;
  metaTitle: string;
  metaDescription: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0900-\u097F-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 100);
}

export default function PostForm({
  initial,
}: {
  initial?: PostFormValues;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [values, setValues] = useState<PostFormValues>(
    initial || {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      status: "DRAFT",
      coverImage: "",
      metaTitle: "",
      metaDescription: "",
    }
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof PostFormValues>(
    key: K,
    val: PostFormValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      ...values,
      slug: values.slug || slugify(values.title),
    };

    const res = isEdit
      ? await apiPut(`/api/posts/admin/${initial!.id}`, payload)
      : await apiPost("/api/posts", payload);

    setSubmitting(false);

    if (res.success) {
      router.push("/admin/news");
    } else {
      setError(res.message || "सहेजने में विफल रहा।");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-line rounded-2xl p-6 space-y-5 max-w-2xl"
    >
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          शीर्षक *
        </label>

        <input
          id="title"
          required
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary"
        />
      </div>

      {/* Slug */}
      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          Slug (URL) — खाली छोड़ने पर स्वतः बनेगा
        </label>

        <input
          id="slug"
          value={values.slug}
          onChange={(e) => update("slug", e.target.value)}
          placeholder="example-post-title"
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary font-mono"
        />
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          श्रेणी
        </label>

        <input
          id="category"
          value={values.category}
          onChange={(e) => update("category", e.target.value)}
          placeholder="जैसे: कार्यक्रम, घोषणा"
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label
          htmlFor="excerpt"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          संक्षिप्त विवरण
        </label>

        <textarea
          id="excerpt"
          rows={2}
          value={values.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary"
        />
      </div>

      {/* Cover Image */}
      <div>
        <label
          htmlFor="coverImage"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          समाचार चित्र
        </label>

        <input
          id="coverImage"
          type="url"
          value={values.coverImage}
          onChange={(e) => update("coverImage", e.target.value)}
          placeholder="https://example.com/news-image.jpg"
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary"
        />

        <p className="text-xs text-muted mt-1.5">
          समाचार के लिए image URL डालें।
        </p>
      </div>

      {/* Content */}
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          पूर्ण विवरण *
        </label>

        <textarea
          id="content"
          required
          rows={8}
          value={values.content}
          onChange={(e) => update("content", e.target.value)}
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary"
        />
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          स्थिति
        </label>

        <select
          id="status"
          value={values.status}
          onChange={(e) =>
            update(
              "status",
              e.target.value as PostFormValues["status"]
            )
          }
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm bg-white"
        >
          <option value="DRAFT">ड्राफ्ट</option>
          <option value="PUBLISHED">प्रकाशित करें</option>
          <option value="ARCHIVED">संग्रहीत करें</option>
        </select>
      </div>

      {/* Meta Title */}
      <div>
        <label
          htmlFor="metaTitle"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          Meta Title
        </label>

        <input
          id="metaTitle"
          value={values.metaTitle}
          onChange={(e) => update("metaTitle", e.target.value)}
          maxLength={200}
          placeholder="SEO के लिए शीर्षक"
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary"
        />
      </div>

      {/* Meta Description */}
      <div>
        <label
          htmlFor="metaDescription"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          Meta Description
        </label>

        <textarea
          id="metaDescription"
          rows={3}
          maxLength={300}
          value={values.metaDescription}
          onChange={(e) => update("metaDescription", e.target.value)}
          placeholder="Search engines के लिए छोटा विवरण..."
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-primary"
        />
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
        disabled={submitting}
        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
      >
        {submitting ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <Save size={16} />
        )}

        सहेजें
      </button>
    </form>
  );
}
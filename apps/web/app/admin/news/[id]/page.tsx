"use client";

import { useEffect, useState, use as usePromise } from "react";
import { Loader2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import PostForm from "@/components/admin/PostForm";
import { apiGet } from "@/lib/api";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  coverImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
};

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Post[]>("/api/posts/admin/all").then((res) => {
      if (res.success && res.data) {
        const found = res.data.find((p) => p.id === id);
        setPost(found || null);
      }
      setLoading(false);
    });
  }, [id]);

  return (
    <AdminShell title="समाचार संपादित करें">
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : !post ? (
        <p className="text-muted">समाचार नहीं मिला।</p>
      ) : (
        <PostForm
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          content: post.content,
          category: post.category || "",
          status: post.status,
          coverImage: post.coverImage || "",
          metaTitle: post.metaTitle || "",
          metaDescription: post.metaDescription || "",
        }}
        />
      )}
    </AdminShell>
  );
}


import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Placeholder from "@/components/Placeholder";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  category: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type PostResponse = {
  success: boolean;
  data: Post | null;
  message: string;
  errors: unknown;
};

async function getPost(slug: string): Promise<Post | null> {
  const API_URL =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000";

  const res = await fetch(
    `${API_URL}/api/posts/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return null;
  }

  const result: PostResponse = await res.json();

  if (!result.success || !result.data) {
    return null;
  }

  return result.data;
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const item = await getPost(slug);

  if (!item || item.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <main>
      <Header />

      <article className="container-page py-10 md:py-14 max-w-3xl">
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <Calendar size={14} />

          {new Date(
            item.publishedAt || item.createdAt
          ).toLocaleDateString("hi-IN")}
        </p>

        {item.category && (
          <p className="text-sm text-primary font-semibold mt-2">
            {item.category}
          </p>
        )}

        <h1 className="font-display text-2xl md:text-3xl font-bold text-ink mt-2">
          {item.title}
        </h1>

        {item.coverImage ? (
          <img
            src={item.coverImage}
            alt={item.title}
            className="w-full aspect-video object-cover rounded-2xl mt-6"
          />
        ) : (
          <Placeholder
            label="समाचार चित्र"
            variant="meeting"
            className="w-full aspect-video rounded-2xl mt-6"
          />
        )}

        {item.excerpt && (
          <p className="text-muted leading-relaxed mt-6">
            {item.excerpt}
          </p>
        )}

        <div className="text-ink leading-relaxed mt-4 whitespace-pre-line">
          {item.content}
        </div>
      </article>

      <Footer />
    </main>
  );
}


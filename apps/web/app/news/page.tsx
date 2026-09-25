import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "समाचार एवं अपडेट",
};

const variants = ["meeting", "handshake", "plantation"] as const;

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
};

type PostsResponse = {
  success: boolean;
  data: Post[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
  };
};

async function getPosts(): Promise<Post[]> {
  const res = await fetch("http://localhost:4000/api/posts", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  const result: PostsResponse = await res.json();

  return result.data.filter((post) => post.status === "PUBLISHED");
}

export default async function NewsPage() {
  const newsItems = await getPosts();

  return (
    <main>
      <Header />

      <PageBanner
        eyebrow="मीडिया"
        title="समाचार एवं अपडेट"
        subtitle="क्षेत्र भ्रमण, कार्यक्रमों और घोषणाओं की ताजा जानकारी।"
      />

      <section className="container-page py-12 md:py-16">
        {newsItems.length === 0 ? (
          <p className="text-center text-muted">
            अभी कोई समाचार उपलब्ध नहीं है।
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {newsItems.map((item, i) => (
              <article
                key={item.id}
                className="border border-line rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                {item.coverImage ? (
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <Placeholder
                    label="समाचार चित्र"
                    variant={variants[i % variants.length]}
                    className="w-full aspect-video"
                  />
                )}

                <div className="p-5">
                  <p className="flex items-center gap-1.5 text-xs text-muted">
                    <Calendar size={12} />

                    {new Date(
                      item.publishedAt || item.createdAt
                    ).toLocaleDateString("hi-IN")}
                  </p>

                  {item.category && (
                    <p className="text-xs text-primary font-semibold mt-2">
                      {item.category}
                    </p>
                  )}

                  <h3 className="font-display font-bold text-ink mt-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted mt-2 line-clamp-2">
                    {item.excerpt}
                  </p>

                  <Link
                    href={`/news/${item.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-4 hover:underline"
                  >
                    और पढ़ें <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

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
  const API_URL =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000";

  const res = await fetch(`${API_URL}/api/posts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("समाचार लोड नहीं हो सके।");
  }

  const result: PostsResponse = await res.json();

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error("समाचार डेटा सही नहीं है।");
  }

  return result.data.filter((post) => post.status === "PUBLISHED");
}

export default async function NewsPage() {
  let newsItems: Post[] = [];

  try {
    newsItems = await getPosts();
  } catch (error) {
    console.error("Failed to load news:", error);
  }

  return (
    <main>
      <Header />

      <PageBanner
        title="समाचार एवं अपडेट"
        subtitle="क्षेत्र की गतिविधियों, विकास कार्यों और जनसेवा से जुड़ी ताज़ा खबरें"
      />

      <section className="container-page py-12 md:py-16">
        {newsItems.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar
              size={42}
              className="mx-auto mb-4 text-muted"
            />
            <h2 className="text-xl font-bold text-ink">
              अभी कोई समाचार उपलब्ध नहीं है
            </h2>
            <p className="mt-2 text-sm text-muted">
              नए समाचार प्रकाशित होने पर वे यहाँ दिखाई देंगे।
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((item, i) => {
              const date = new Date(
                item.publishedAt || item.createdAt
              ).toLocaleDateString("hi-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });

              return (
                <article
                  key={item.slug}
                  className="overflow-hidden rounded-2xl border border-line bg-white transition-shadow duration-300 hover:shadow-lg"
                >
                  {/* Clickable news image */}
                  <Link
                    href={`/news/${item.slug}`}
                    className="block aspect-video overflow-hidden bg-gray-100"
                    aria-label={`${item.title} पढ़ें`}
                  >
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <Placeholder
                        label="समाचार चित्र"
                        variant={variants[i % variants.length]}
                        className="h-full w-full"
                      />
                    )}
                  </Link>

                  <div className="p-5">
                    <p className="text-xs text-muted">{date}</p>

                    {item.category && (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">
                        {item.category}
                      </p>
                    )}

                    {/* Clickable news title */}
                    <Link
                      href={`/news/${item.slug}`}
                      className="block hover:text-primary transition-colors"
                    >
                      <h2 className="mt-2 font-display text-lg font-bold leading-snug text-ink">
                        {item.title}
                      </h2>
                    </Link>

                    {item.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted">
                        {item.excerpt}
                      </p>
                    )}

                    {/* और पढ़ें button — same position */}
                    <Link
                      href={`/news/${item.slug}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                      और पढ़ें <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

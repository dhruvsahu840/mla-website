
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Placeholder from "./Placeholder";
import { apiGet } from "@/lib/api";

const variants = ["meeting", "handshake", "plantation"] as const;

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  createdAt: string;
};

export default async function LatestNews() {
  let newsItems: Post[] = [];

  try {
    const response = await apiGet<Post[]>("/api/posts?page=1&pageSize=3");

    if (response.success && Array.isArray(response.data)) {
      newsItems = response.data;
    }
  } catch {
    newsItems = [];
  }

  return (
    <section className="container-page py-6 md:py-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
          ताजा समाचार
        </h2>

        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          सभी देखें <ArrowRight size={16} />
        </Link>
      </div>

      {newsItems.length === 0 ? (
        <p className="text-muted">अभी कोई समाचार उपलब्ध नहीं है।</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
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
                className="overflow-hidden rounded-2xl border border-line  bg-white"
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

                  {/* Clickable news title */}
                  <Link
                    href={`/news/${item.slug}`}
                    className="block transition-colors hover:text-primary"
                  >
                    <h3 className="font-display font-bold text-ink mt-2 leading-snug">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-muted mt-2 line-clamp-2">
                    {item.excerpt}
                  </p>

                  {/* और पढ़ें button — original position preserved */}
                  <Link
                    href={`/news/${item.slug}`}
                    className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:underline"
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
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Placeholder from "./Placeholder";
import { newsItems } from "@/lib/site-content";

const variants = ["meeting", "handshake", "plantation"] as const;

export default function LatestNews() {
  return (
    <section className="container-page py-16 md:py-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">ताजा समाचार</h2>
        <Link href="/news" className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline">
          सभी देखें <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {newsItems.map((item, i) => (
          <article key={item.slug} className="border border-line rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow">
            <Placeholder label="समाचार चित्र" variant={variants[i % variants.length]} className="w-full aspect-video" />
            <div className="p-5">
              <p className="text-xs text-muted">{item.date}</p>
              <h3 className="font-display font-bold text-ink mt-2 leading-snug">{item.title}</h3>
              <p className="text-sm text-muted mt-2 line-clamp-2">{item.excerpt}</p>
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
    </section>
  );
}

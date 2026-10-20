import Link from "next/link";
import { homeHero } from "@/lib/home-hero";

export default function HeroButtons() {
  return (
    <section className=" px-4 py-6 sm:py-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4">
        <Link
          href={homeHero.primaryButton.href}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-700 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800"
        >
          {homeHero.primaryButton.text}
        </Link>

        <Link
          href={homeHero.secondaryButton.href}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-emerald-700 bg-white px-7 py-3 text-sm font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:bg-emerald-50"
        >
          {homeHero.secondaryButton.text}
        </Link>
      </div>
    </section>
  );
}
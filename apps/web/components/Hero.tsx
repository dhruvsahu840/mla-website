import Link from "next/link";
import Placeholder from "./Placeholder";
import { site } from "@/lib/site-content";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Decorative tricolor wave, like the reference design */}
      <svg
        className="absolute bottom-0 left-0 w-full h-28 md:h-40 pointer-events-none"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 120C300 40 900 200 1200 100V200H0Z" fill="#f2811d" opacity="0.9" />
        <path d="M0 150C300 90 900 220 1200 140V200H0Z" fill="#146c43" opacity="0.9" />
      </svg>

      <div className="container-page relative grid md:grid-cols-2 gap-10 items-center py-12 md:py-20">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight text-ink">
            जनता का विश्वास
            <br />
            <span className="text-accent">हमारी सबसे बड़ी ताकत</span>
          </h1>
          <p className="mt-5 text-muted text-base md:text-lg max-w-lg">
            क्षेत्र के सर्वांगीण विकास, शिक्षा, स्वास्थ्य, रोजगार और सुखद भविष्य के लिए निरंतर प्रयासरत।
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/about"
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              हमारे बारे में जानें
            </Link>
            <Link
              href="/contact"
              className="bg-white border border-line hover:border-primary text-ink font-semibold px-6 py-3 rounded-full transition-colors"
            >
              हमसे जुड़ें →
            </Link>
          </div>
        </div>

        <div className="relative">
          <img className="w-full " src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUZWus1PBx2UlVs9xBv3wQ9QWjcscWEC6BGsZm12KBDg&s=10" alt="" />
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const points = [
  "पारदर्शिता, ईमानदारी और जनसेवा हमारी पहचान",
  "विकास कार्यों में आपकी भागीदारी, हमारी प्राथमिकता",
  "हर वर्ग के उत्थान के लिए संकल्पित",
];

export default function AboutPreview() { 
  return (
    <section className="container-page py-16 md:py-24">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
        {/* About Image */}
        <div className="relative min-h-[320px] w-full overflow-hidden rounded-2xl md:min-h-[440px]">
          <Image
            src="/images/image1.png"
            alt="जनसेवा और क्षेत्र के विकास के लिए समर्पित"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />

          {/* Image Caption */}
          <div className="absolute bottom-5 left-5 z-10 max-w-[220px] rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg">
            जनता की सेवा हमारा धर्म है।
          </div>
        </div>

        {/* About Content */}
        <div>
          <p className="text-sm font-semibold tracking-wide text-accent">
            हमारे बारे में
          </p>

          <h2 className="mt-2 font-display text-3xl font-bold text-ink md:text-4xl">
            आपका विधायक, आपके द्वार
          </h2>

          <p className="mt-4 leading-relaxed text-muted">
            मेरा उद्देश्य केवल राजनीति नहीं, बल्कि समाज सेवा और क्षेत्र का
            समग्र विकास है। शिक्षा, स्वास्थ्य, सड़क, पानी, बिजली और रोजगार
            के क्षेत्र में निरंतर कार्य कर रहा हूँ ताकि हमारे क्षेत्र का हर
            नागरिक एक बेहतर जीवन जी सके।
          </p>

          {/* Key Points */}
          <ul className="mt-6 space-y-3">
            {points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-sm text-ink"
              >
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-primary"
                  size={18}
                  aria-hidden="true"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {/* Learn More Button */}
          <Link
            href="/about"
            className="mt-7 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            और जानें →
          </Link>
        </div>
      </div>
    </section>
  );
}

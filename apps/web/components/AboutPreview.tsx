import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Placeholder from "./Placeholder";

const points = [
  "पारदर्शिता, ईमानदारी और जनसेवा हमारी पहचान",
  "विकास कार्यों में आपकी भागीदारी, हमारी प्राथमिकता",
  "हर वर्ग के उत्थान के लिए संकल्पित",
];

export default function AboutPreview() {
  return (
    <section className="container-page py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="relative">
          <Placeholder
            label="क्षेत्र भ्रमण की तस्वीर यहाँ जोड़ें"
            variant="handshake"
            className="w-full aspect-[4/5] rounded-2xl"
          />
          
          <div className="absolute -bottom-5 left-5 bg-primary text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg max-w-[200px]">
            जनता की सेवा हमारा धर्म है।
          </div>
        </div>

        <div>
          <p className="text-accent font-semibold text-sm tracking-wide">हमारे बारे में</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mt-2">
            आपका विधायक, आपके द्वार
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            मेरा उद्देश्य केवल राजनीति नहीं, बल्कि समाज सेवा और क्षेत्र का समग्र विकास है। शिक्षा, स्वास्थ्य,
            सड़क, पानी, बिजली और रोजगार के क्षेत्र में निरंतर कार्य कर रहा हूँ ताकि हमारे क्षेत्र का हर नागरिक
            एक बेहतर जीवन जी सके।
          </p>
          <ul className="mt-6 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-ink">
                <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={18} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/about"
            className="inline-block mt-7 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            और जानें →
          </Link>
        </div>
      </div>
    </section>
  );
}

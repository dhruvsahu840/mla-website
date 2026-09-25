import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Placeholder from "./Placeholder";
import { site } from "@/lib/site-content";

export default function ContactCta() {
  return (
    <section className="bg-primary-light py-16 md:py-20">
      <div className="container-page grid md:grid-cols-2 gap-10 items-center">
        <div className="relative">
          <Placeholder label="जनसंपर्क तस्वीर यहाँ जोड़ें" variant="handshake" className="w-full aspect-[5/4] rounded-2xl" />
        </div>

        <div>
          <p className="text-accent font-semibold text-sm tracking-wide">हमसे जुड़ें</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mt-2 leading-snug">
            आइए, मिलकर बनाएं <br /> बेहतर और सशक्त क्षेत्र
          </h2>
          <p className="mt-4 text-muted max-w-md">
            अपने सुझाव दें, समस्याएं बताएं या अपने अधिकारियों से सीधे जुड़ें। हम आपके साथ हर कदम पर हैं।
          </p>
          <Link
            href="/grievance"
            className="inline-block mt-6 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            संपर्क करें
          </Link>

          <div className="mt-8 space-y-3 bg-white rounded-2xl border border-line p-5 max-w-sm">
            <p className="flex items-center gap-3 text-sm text-ink">
              <Phone size={16} className="text-primary shrink-0" /> {site.phone}
            </p>
            <p className="flex items-center gap-3 text-sm text-ink">
              <Mail size={16} className="text-primary shrink-0" /> {site.email}
            </p>
            <p className="flex items-start gap-3 text-sm text-ink">
              <MapPin size={16} className="text-primary shrink-0 mt-0.5" /> {site.address}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

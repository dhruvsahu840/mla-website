import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Placeholder from "@/components/Placeholder";
import { site } from "@/lib/site-content";

export const metadata: Metadata = { title: "हमारे बारे में" };

const priorities = [
  "शिक्षा एवं कौशल विकास",
  "स्वास्थ्य सुविधाओं का विस्तार",
  "सड़क, पानी और बिजली की बुनियादी सुविधाएं",
  "रोजगार एवं स्वरोजगार के अवसर",
  "पारदर्शी व जवाबदेह प्रशासन",
];

export default function AboutPage() {
  return (
    <main>
      <Header />

      <section className="bg-primary-light py-10">
        <div className="container-page">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">हमारे बारे में</h1>
          <p className="text-muted mt-2">{site.mlaName} — {site.constituency}</p>
        </div>
      </section>

      <section className="container-page py-12 md:py-16 grid md:grid-cols-2 gap-10 items-start">
        <Placeholder label={`${site.mlaName} — आधिकारिक चित्र यहाँ जोड़ें`} variant="portrait" className="w-full aspect-[4/5] rounded-2xl" />

        <div>
          <h2 className="font-display text-2xl font-bold text-ink">परिचय</h2>
          <p className="text-muted mt-3 leading-relaxed">
            [यहाँ विधायक जी की सत्यापित जीवनी, शिक्षा और सार्वजनिक जीवन का विवरण जोड़ा जाएगा। यह अनुभाग वास्तविक
            जानकारी उपलब्ध होने पर अद्यतन किया जाएगा।]
          </p>
          <p className="text-muted mt-3 leading-relaxed">
            [राजनीतिक यात्रा, पूर्व दायित्व और जनसेवा से जुड़े अनुभव यहां शामिल किए जाएंगे।]
          </p>

          <h2 className="font-display text-2xl font-bold text-ink mt-8">हमारी प्राथमिकताएं</h2>
          <ul className="mt-4 space-y-3">
            {priorities.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-ink">
                <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={18} />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}

import type { Metadata } from "next";
import { MapPin, Users, Home, Landmark } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import Placeholder from "@/components/Placeholder";
import { site } from "@/lib/site-content";

export const metadata: Metadata = { title: "हमारा क्षेत्र" };

const areaFacts = [
  { icon: Users, label: "कुल जनसंख्या", value: "[सत्यापन लंबित]" },
  { icon: Home, label: "गांव / वार्ड", value: "[सत्यापन लंबित]" },
  { icon: Landmark, label: "प्रमुख स्थान", value: "[सत्यापन लंबित]" },
  { icon: MapPin, label: "क्षेत्रफल", value: "[सत्यापन लंबित]" },
];

const importantPlaces = ["तहसील कार्यालय", "जिला अस्पताल", "मुख्य बाजार", "रेलवे स्टेशन", "स्टेडियम", "बस स्टैंड"];

export default function ConstituencyPage() {
  return (
    <main>
      <Header />
      <PageBanner eyebrow="हमारा क्षेत्र" title={site.constituency} subtitle="क्षेत्र की जानकारी, महत्वपूर्ण स्थान और विकास से जुड़े आंकड़े।" />

      <section className="container-page py-12 md:py-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 mb-14">
          {areaFacts.map((fact) => {
            const Icon = fact.icon;
            return (
              <div key={fact.label} className="bg-white border border-line rounded-2xl p-5 text-center">
                <span className="inline-flex h-11 w-11 rounded-full bg-primary-light text-primary items-center justify-center mb-3">
                  <Icon size={20} />
                </span>
                <p className="font-display font-bold text-ink">{fact.value}</p>
                <p className="text-xs text-muted mt-1">{fact.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center mb-14">
          <Placeholder label="क्षेत्र का मानचित्र / तस्वीर यहां जोड़ें" variant="landscape" className="w-full aspect-[4/3] rounded-2xl" />
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">क्षेत्र परिचय</h2>
            <p className="text-muted mt-3 leading-relaxed">
              [यहां विधानसभा क्षेत्र का सत्यापित परिचय, भौगोलिक विवरण और ऐतिहासिक महत्व जोड़ा जाएगा। यह
              जानकारी आधिकारिक स्रोतों से सत्यापन के बाद प्रकाशित की जाएगी।]
            </p>
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold text-ink mb-6">महत्वपूर्ण स्थान</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {importantPlaces.map((place) => (
            <div key={place} className="flex items-center gap-3 bg-white border border-line rounded-xl p-4">
              <MapPin size={16} className="text-primary shrink-0" />
              <span className="text-sm font-medium text-ink">{place}</span>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}

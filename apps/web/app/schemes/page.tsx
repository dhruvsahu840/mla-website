import type { Metadata } from "next";
import { FileCheck2, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { schemes } from "@/lib/site-content";

export const metadata: Metadata = { title: "योजनाएं" };

export default function SchemesPage() {
  return (
    <main>
      <Header />
      <PageBanner
        eyebrow="योजनाएं"
        title="सरकारी योजनाओं की जानकारी"
        subtitle="पात्रता, आवश्यक दस्तावेज़ और आवेदन प्रक्रिया की सरल भाषा में जानकारी।"
      />

      <section className="container-page py-12 md:py-16 space-y-6">
        {schemes.map((scheme) => (
          <article key={scheme.slug} className="border border-line rounded-2xl bg-white p-6 md:p-8">
            <h2 className="font-display text-xl font-bold text-ink">{scheme.title}</h2>
            <p className="text-muted mt-2">{scheme.description}</p>

            <div className="grid sm:grid-cols-2 gap-6 mt-5">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-ink mb-2">
                  <FileCheck2 size={16} className="text-primary" /> पात्रता
                </p>
                <p className="text-sm text-muted leading-relaxed">{scheme.eligibility}</p>
              </div>
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-ink mb-2">
                  <FileText size={16} className="text-primary" /> आवश्यक दस्तावेज़
                </p>
                <ul className="text-sm text-muted space-y-1 list-disc list-inside">
                  {scheme.documents.map((doc) => (
                    <li key={doc}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-xs text-muted mt-5 bg-accent-light rounded-lg px-4 py-2.5 inline-block">
              अधिक जानकारी व आवेदन हेतु निकटतम जनसेवा केंद्र या विधायक कार्यालय से संपर्क करें।
            </p>
          </article>
        ))}
      </section>
      <Footer />
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GrievanceForm from "@/components/GrievanceForm";

export const metadata: Metadata = { title: "जनसुनवाई / शिकायत दर्ज करें" };

export default function GrievancePage() {
  return (
    <main>
      <Header />
      <section className="bg-primary-light py-10">
        <div className="container-page">
          <p className="text-accent font-semibold text-sm">जनसुनवाई</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mt-1">अपनी शिकायत दर्ज करें</h1>
          <p className="text-muted mt-2 max-w-xl">
            अपनी समस्या, सुझाव या अनुरोध यहाँ दर्ज करें। दर्ज करते ही आपको एक संदर्भ क्रमांक मिलेगा, जिससे आप स्थिति ट्रैक कर सकते हैं।
          </p>
          <Link href="/grievance/track" className="inline-block mt-3 text-sm font-semibold text-primary hover:underline">
            पहले से दर्ज शिकायत की स्थिति देखें →
          </Link>
        </div>
      </section>

      <section className="container-page py-10 md:py-14 max-w-2xl">
        <GrievanceForm />
      </section>
      <Footer />
    </main>
  );
}

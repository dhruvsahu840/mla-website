import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrackGrievance from "@/components/TrackGrievance";

export const metadata: Metadata = { title: "शिकायत की स्थिति ट्रैक करें" };

export default function TrackPage() {
  return (
    <main>
      <Header />
      <section className="bg-primary-light py-10">
        <div className="container-page">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">शिकायत की स्थिति ट्रैक करें</h1>
          <p className="text-muted mt-2">अपना संदर्भ क्रमांक दर्ज करके शिकायत की वर्तमान स्थिति देखें।</p>
        </div>
      </section>
      <section className="container-page py-10 md:py-14 max-w-2xl">
        <TrackGrievance />
      </section>
      <Footer />
    </main>
  );
}

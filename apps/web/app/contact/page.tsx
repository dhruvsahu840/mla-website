import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site-content";

export const metadata: Metadata = { title: "संपर्क करें" };

export default function ContactPage() {
  return (
    <main>
      <Header />
      <section className="bg-primary-light py-10">
        <div className="container-page">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">संपर्क करें</h1>
          <p className="text-muted mt-2">आपके सुझाव और प्रश्नों का स्वागत है।</p>
        </div>
      </section>

      <section className="container-page py-10 md:py-14 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-3">
          <ContactForm />
        </div>

        <aside className="md:col-span-2 space-y-4">
          <div className="bg-white border border-line rounded-2xl p-5 flex gap-3">
            <Phone className="text-primary shrink-0" size={20} />
            <div>
              <p className="font-semibold text-ink text-sm">फोन करें</p>
              <p className="text-sm text-muted">{site.phone}</p>
            </div>
          </div>
          <div className="bg-white border border-line rounded-2xl p-5 flex gap-3">
            <Mail className="text-primary shrink-0" size={20} />
            <div>
              <p className="font-semibold text-ink text-sm">ईमेल करें</p>
              <p className="text-sm text-muted">{site.email}</p>
            </div>
          </div>
          <div className="bg-white border border-line rounded-2xl p-5 flex gap-3">
            <MapPin className="text-primary shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-ink text-sm">कार्यालय पता</p>
              <p className="text-sm text-muted">{site.address}</p>
            </div>
          </div>
          <div className="bg-white border border-line rounded-2xl p-5 flex gap-3">
            <Clock className="text-primary shrink-0" size={20} />
            <div>
              <p className="font-semibold text-ink text-sm">कार्यालय समय</p>
              <p className="text-sm text-muted">{site.officeHours}</p>
            </div>
          </div>
        </aside>
      </section>
      <Footer />
    </main>
  );
}

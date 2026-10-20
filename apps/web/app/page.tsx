import Header from "@/components/Header";
import Hero from "@/components/Hero";
import QuickLinks from "@/components/QuickLinks";
import HeroButtons from "@/components/HeroButtons";
import AboutPreview from "@/components/AboutPreview";
import Stats from "@/components/Stats";
import LatestNews from "@/components/LatestNews";
import EventsPreview from "@/components/EventsPreview";
import GalleryPreview from "@/components/GalleryPreview";
import ContactCta from "@/components/ContactCta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <QuickLinks />
      <HeroButtons/>
      <AboutPreview />
      <Stats />
      <LatestNews />
      <EventsPreview />
      <GalleryPreview />
      <ContactCta />
      <Footer />
    </main>
  );
}

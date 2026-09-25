"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import { site, footerLinks } from "@/lib/site-content";
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIconCustom } from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white/90">
      <div className="container-page py-12 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="font-display font-bold text-white text-lg">{site.mlaName}</p>
          <p className="text-sm text-white/70 mt-1">{site.tagline}</p>
          <p className="text-sm text-white/70 mt-4 leading-relaxed">
            क्षेत्र के विकास और जनता के उत्थान के लिए समर्पित। आपका विधायक हमेशा आपके साथ।
          </p>
          <div className="flex gap-3 mt-4">
            <a href={site.social.facebook} aria-label="Facebook" className="hover:text-accent"><FacebookIcon size={16} /></a>
            <a href={site.social.twitter} aria-label="Twitter" className="hover:text-accent"><TwitterIcon size={16} /></a>
            <a href={site.social.instagram} aria-label="Instagram" className="hover:text-accent"><InstagramIcon size={16} /></a>
            <a href={site.social.youtube} aria-label="Youtube" className="hover:text-accent"><YoutubeIconCustom size={16} /></a>
          </div>
        </div>

        <div>
          <p className="font-semibold text-white mb-3">त्वरित लिंक</p>
          <ul className="space-y-2 text-sm">
            {footerLinks.quick.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/70 hover:text-accent">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white mb-3">महत्वपूर्ण लिंक</p>
          <ul className="space-y-2 text-sm">
            {footerLinks.important.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/70 hover:text-accent">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white mb-3">समाचार पत्रिका</p>
          <p className="text-sm text-white/70 mb-3">नवीनतम अपडेट पाने के लिए हमारे न्यूजलेटर की सदस्यता लें।</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="newsletter-email" className="sr-only">ईमेल</label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="आपका ईमेल दर्ज करें"
              className="flex-1 min-w-0 rounded-full px-4 py-2 text-sm text-ink bg-white/95 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="सदस्यता लें"
              className="bg-accent hover:bg-accent/90 rounded-full p-2.5 shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <p>© {new Date().getFullYear()} {site.mlaName} | सर्वाधिकार सुरक्षित</p>
          <p>वेबसाइट डिज़ाइन व विकसित</p>
        </div>
      </div>
    </footer>
  );
}

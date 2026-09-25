"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { site } from "@/lib/site-content";
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIconCustom } from "./SocialIcons";

const navItems = [
  { label: "होम", href: "/" },
  { label: "हमारे बारे में", href: "/about" },
  { label: "हमारा क्षेत्र", href: "/constituency" },
  { label: "विकास कार्य", href: "/development-works" },
  { label: "योजनाएं", href: "/schemes" },
  { label: "कार्यक्रम", href: "/events" },
  { label: "मीडिया", href: "/news" },
  { label: "गैलरी", href: "/gallery" },
  { label: "जनसंपर्क", href: "/grievance" },
  { label: "संपर्क करें", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar - orange, matches reference */}
      <div className="bg-accent text-white text-[11px] md:text-xs">
        <div className="container-page flex items-center justify-between py-1.5">
          <span className="truncate">जनता का सेवक, आपके साथ हरदम</span>
          <div className="flex items-center gap-3 shrink-0 ml-3">
            <a href={site.social.facebook} aria-label="Facebook" className="hover:text-primary-dark"><FacebookIcon size={13} /></a>
            <a href={site.social.twitter} aria-label="Twitter" className="hover:text-primary-dark"><TwitterIcon size={13} /></a>
            <a href={site.social.instagram} aria-label="Instagram" className="hover:text-primary-dark"><InstagramIcon size={13} /></a>
            <a href={site.social.youtube} aria-label="Youtube" className="hover:text-primary-dark"><YoutubeIconCustom size={13} /></a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container-page flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-primary-light border border-primary/20 flex items-center justify-center text-primary font-display font-bold text-lg">
            MLA
          </div>
          <div>
            <p className="font-display font-bold text-ink leading-tight">{site.mlaName}</p>
            <p className="text-xs text-muted leading-tight">{site.tagline}</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-4 xl:gap-5" aria-label="मुख्य मेनू">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-[13px] xl:text-sm font-medium text-ink hover:text-primary transition-colors whitespace-nowrap">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button aria-label="खोजें" className="p-2 rounded-full hover:bg-primary-light text-ink">
            <Search size={18} />
          </button>
          <Link
            href="/contact"
            className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            संपर्क करें
          </Link>
        </div>

        <button
          className="lg:hidden p-2 text-ink"
          aria-label={open ? "मेनू बंद करें" : "मेनू खोलें"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="lg:hidden border-t border-line bg-white" aria-label="मोबाइल मेनू">
          <ul className="container-page py-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-3 text-sm font-medium text-ink border-b border-line last:border-0"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="py-3">
              <Link
                href="/contact"
                className="block text-center bg-primary text-white font-semibold px-5 py-2.5 rounded-full"
                onClick={() => setOpen(false)}
              >
                संपर्क करें
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

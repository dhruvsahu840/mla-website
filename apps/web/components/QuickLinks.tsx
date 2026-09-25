import Link from "next/link";
import { Hammer, MessageSquareText, FileText, Image as ImageIcon, PhoneCall } from "lucide-react";
import { quickLinks } from "@/lib/site-content";

const icons = [Hammer, MessageSquareText, FileText, ImageIcon, PhoneCall];

export default function QuickLinks() {
  return (
    <section className="container-page -mt-8 md:-mt-12 relative z-10">
      <div className="bg-white rounded-2xl shadow-lg border border-line grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-line">
        {quickLinks.map((link, i) => {
          const Icon = icons[i];
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center text-center gap-2 p-5 hover:bg-primary-light transition-colors"
            >
              <span className="h-11 w-11 rounded-full bg-primary-light text-primary flex items-center justify-center">
                <Icon size={20} />
              </span>
              <span className="text-sm font-semibold text-ink">{link.title}</span>
              <span className="text-xs text-muted hidden sm:block">{link.desc}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

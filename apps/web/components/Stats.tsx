import { Hammer, Users2, Trophy, UserCheck } from "lucide-react";
import { stats } from "@/lib/site-content";

const icons = [Hammer, Users2, Trophy, UserCheck];

export default function Stats() {
  return (
    <section className="bg-primary-light py-14">
      <div className="container-page">
        <p className="text-center text-primary font-semibold text-sm tracking-wide">• हमारी उपलब्धियां •</p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat, i) => {
            const Icon = icons[i];
            return (
              <div key={stat.label} className="bg-white rounded-2xl border border-line p-5 flex items-center gap-4">
                <span className="h-11 w-11 rounded-full bg-accent-light text-accent flex items-center justify-center shrink-0">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="font-display text-xl font-bold text-ink">{stat.value}</p>
                  <p className="text-xs text-muted">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs text-muted mt-6">
          * सभी आंकड़े सांकेतिक हैं और सत्यापन के बाद अद्यतन किए जाएंगे।
        </p>
      </div>
    </section>
  );
}

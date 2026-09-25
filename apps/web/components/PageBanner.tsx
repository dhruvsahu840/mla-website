export default function PageBanner({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="bg-primary-light py-10 md:py-14">
      <div className="container-page">
        {eyebrow && <p className="text-accent font-semibold text-sm">{eyebrow}</p>}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mt-1">{title}</h1>
        {subtitle && <p className="text-muted mt-2 max-w-xl">{subtitle}</p>}
      </div>
    </section>
  );
}

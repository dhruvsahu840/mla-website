type PlaceholderProps = {
  label: string;
  className?: string;
  variant?: "portrait" | "landscape" | "square" | "meeting" | "roadwork" | "plantation" | "handshake";
};

/**
 * Illustrated placeholder graphics used until real, verified photographs are
 * supplied. We deliberately avoid hotlinking or using photos of real people
 * (per project spec §4) — these are original illustrations.
 */
export default function Placeholder({ label, className = "", variant = "landscape" }: PlaceholderProps) {
  return (
    <div className={`relative overflow-hidden bg-primary-light ${className}`} role="img" aria-label={label}>
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`bg-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8f5ee" />
            <stop offset="100%" stopColor="#fef1e2" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill={`url(#bg-${variant})`} />

        {variant === "portrait" && (
          <g>
            <circle cx="200" cy="150" r="70" fill="#146c43" opacity="0.15" />
            <path d="M200 90c33 0 60 27 60 60 0 25-15 46-37 55v20c45 10 85 40 95 85H82c10-45 50-75 95-85v-20c-22-9-37-30-37-55 0-33 27-60 60-60Z" fill="#146c43" opacity="0.35" />
          </g>
        )}

        {variant === "handshake" && (
          <g stroke="#146c43" strokeWidth="6" fill="none" opacity="0.4" strokeLinecap="round">
            <path d="M110 220l60-10 40 15 60-20" />
            <circle cx="110" cy="220" r="10" fill="#f2811d" stroke="none" />
            <circle cx="270" cy="205" r="10" fill="#f2811d" stroke="none" />
          </g>
        )}

        {variant === "meeting" && (
          <g fill="#146c43" opacity="0.3">
            <circle cx="130" cy="180" r="26" />
            <rect x="100" y="212" width="60" height="70" rx="14" />
            <circle cx="270" cy="180" r="26" />
            <rect x="240" y="212" width="60" height="70" rx="14" />
            <circle cx="200" cy="160" r="30" />
            <rect x="165" y="196" width="70" height="86" rx="16" />
          </g>
        )}

        {variant === "roadwork" && (
          <g>
            <rect x="0" y="260" width="400" height="140" fill="#146c43" opacity="0.18" />
            <path d="M0 270L400 260" stroke="#f2811d" strokeWidth="6" strokeDasharray="20 14" opacity="0.5" />
            <rect x="150" y="180" width="18" height="80" rx="4" fill="#f2811d" opacity="0.5" />
            <path d="M159 180l30 20-30 8-30-8Z" fill="#f2811d" opacity="0.6" />
          </g>
        )}

        {variant === "plantation" && (
          <g fill="#146c43" opacity="0.35">
            <ellipse cx="140" cy="200" rx="30" ry="40" />
            <rect x="134" y="235" width="12" height="50" />
            <ellipse cx="230" cy="180" rx="36" ry="48" />
            <rect x="223" y="222" width="14" height="60" />
            <ellipse cx="300" cy="210" rx="24" ry="32" />
            <rect x="295" y="238" width="10" height="42" />
          </g>
        )}

        {(variant === "landscape" || variant === "square") && (
          <g fill="#146c43" opacity="0.25">
            <path d="M0 280L90 200l70 60 60-90 180 110V400H0Z" />
            <circle cx="320" cy="110" r="34" fill="#f2811d" opacity="0.55" />
          </g>
        )}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-end gap-1 pb-3 px-2">
        <span className="text-[11px] font-medium text-center leading-snug text-primary-dark bg-white/70 backdrop-blur-sm rounded-full px-3 py-1">
          {label}
        </span>
      </div>
    </div>
  );
}

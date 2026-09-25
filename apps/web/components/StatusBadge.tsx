const statusConfig = {
  proposed: { label: "प्रस्तावित", className: "bg-gray-100 text-gray-700" },
  in_progress: { label: "प्रगति में", className: "bg-accent-light text-accent-dark" },
  completed: { label: "पूर्ण", className: "bg-primary-light text-primary-dark" },
  on_hold: { label: "रोका गया", className: "bg-red-50 text-red-700" },
};

export default function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const cfg = statusConfig[status];
  return (
    <span className={`text-xs font-semibold rounded-full px-3 py-1 ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

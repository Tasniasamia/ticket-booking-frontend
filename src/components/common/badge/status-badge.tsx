type Tone = "success" | "danger" | "warning" | "neutral";

const toneClasses: Record<Tone, { badge: string; dot: string }> = {
  success: {
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  danger: {
    badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    dot: "bg-rose-400",
  },
  warning: {
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    dot: "bg-amber-400",
  },
  neutral: {
    badge: "bg-fg/10 text-fg/70 border-fg/20",
    dot: "bg-fg/50",
  },
};

export function StatusBadge({ label, tone }: { label: string; tone: Tone }) {
  const t = toneClasses[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium capitalize ${t.badge}`}
    >
      <span className={`size-1.5 rounded-full ${t.dot}`} />
      {label}
    </span>
  );
}
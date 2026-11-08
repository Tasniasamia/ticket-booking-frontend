import type { ReactNode } from "react";
import {
  Wallet, Ticket, CalendarDays, UserPlus, TrendingUp, TrendingDown, Armchair, CircleDollarSign,
} from "lucide-react";
import dayjs from "dayjs";
import type { RevenuePoint } from "@/features/dashboard/types";

const card = "rounded-2xl border border-fg/15 bg-panel/50 p-5";

export const icons = { Wallet, Ticket, CalendarDays, UserPlus, Armchair, CircleDollarSign };

export function StatCard({
  label, value, icon, changePct, hint,
}: { label: string; value: ReactNode; icon: ReactNode; changePct?: number | null; hint?: string }) {
  const up = (changePct ?? 0) >= 0;
  return (
    <div className={card}>
      <div className="flex items-center justify-between text-sm text-fg/60">
        {label}
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-fg/10">{icon}</span>
      </div>
      <div className="mt-3 text-3xl font-bold tabular-nums">{value}</div>
      {changePct != null ? (
        <div className={`mt-2 flex items-center gap-1 text-xs ${up ? "text-emerald-400" : "text-rose-400"}`}>
          {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {up ? "+" : ""}{changePct.toFixed(1)}%
          <span className="text-fg/50">vs previous 4 weeks</span>
        </div>
      ) : hint ? <div className="mt-2 text-xs text-fg/50">{hint}</div> : null}
    </div>
  );
}

export function Section({ title, subtitle, right, children, className = "" }: {
  title: string; subtitle?: string; right?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <section className={`${card} ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-fg/50">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

const STATUS_TONE: Record<string, string> = {
  paid: "bg-emerald-500/15 text-emerald-400",
  approved: "bg-emerald-500/15 text-emerald-400",
  pending: "bg-amber-500/15 text-amber-400",
  failed: "bg-rose-500/15 text-rose-400",
  cancelled: "bg-fg/10 text-fg/60",
  canceled: "bg-fg/10 text-fg/60",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs capitalize ${STATUS_TONE[status] ?? "bg-fg/10 text-fg/60"}`}>
      ● {status}
    </span>
  );
}

export function DateChip({ iso }: { iso: string }) {
  const d = dayjs(iso);
  if (!d.isValid()) return null;
  return (
    <div suppressHydrationWarning className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-fg/10 text-center leading-tight">
      <div>
        <div className="text-base font-bold">{d.format("DD")}</div>
        <div className="text-[11px] text-fg/60">{d.format("MMM")}</div>
      </div>
    </div>
  );
}

export function EventThumb({ url }: { url?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url || "/default.jpg"} alt="" loading="lazy" decoding="async" className="h-14 w-14 shrink-0 rounded-lg object-cover" />;
}

export function SeatBar({ booked, total }: { booked: number; total: number }) {
  const fill = total ? Math.min((booked / total) * 100, 100) : 0;
  return (
    <div className="mt-1.5 h-1.5 rounded-full bg-fg/10">
      <div className="h-full rounded-full bg-coral" style={{ width: `${fill}%` }} />
    </div>
  );
}

export function AreaChart({ points }: { points: RevenuePoint[] }) {
  const W = 600, H = 200;
  const max = Math.max(...points.map((p) => p.amount), 1);
  const step = W / Math.max(points.length - 1, 1);
  const xy = points.map((p, i) => [i * step, H - (p.amount / max) * (H - 24) - 12]);
  const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const last = xy[xy.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-56 w-full">
      <defs>
        <linearGradient id="rev" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#d946ef" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${W},${H} L0,${H} Z`} fill="url(#rev)" />
      <path d={line} fill="none" stroke="#e879f9" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      {last && <circle cx={last[0]} cy={last[1]} r="4" fill="#fb7185" />}
    </svg>
  );
}

export function Empty({ text }: { text: string }) {
  return <p className="py-6 text-center text-sm text-fg/50">{text}</p>;
}

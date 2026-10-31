import Image from "next/image";
import Link from "next/link";
import { Ticket, TrendingDown, TrendingUp, UserPlus, CalendarDays, Wallet, type LucideIcon } from "lucide-react";
import { StatusBadge } from "@/components/common/badge/status-badge";
import { EVENTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Mock data: backend ready হলে এই অংশ API এর data দিয়ে বদলাও          */
/* ------------------------------------------------------------------ */

// প্রতি সপ্তাহের revenue (USD), পুরনো থেকে নতুন
const WEEKLY_REVENUE = [3200, 4100, 3800, 5200, 4700, 6100, 5800, 7200, 6600, 8100, 7600, 8900];

type BookingStatus = "Paid" | "Pending" | "Refunded" | "Failed";
const RECENT_BOOKINGS: { code: string; customer: string; event: string; amount: number; status: BookingStatus }[] = [
  { code: "TB-48213", customer: "Ayesha Rahman", event: "Classic Rock Legends Tour", amount: 180, status: "Paid" },
  { code: "TB-48212", customer: "Imran Hossain", event: "Electric Beach Festival", amount: 240, status: "Paid" },
  { code: "TB-48210", customer: "Farzana Islam", event: "Midnight Club Sessions", amount: 80, status: "Pending" },
  { code: "TB-48207", customer: "Tanvir Ahmed", event: "Skyline Paint & Party Night", amount: 65, status: "Refunded" },
  { code: "TB-48205", customer: "Mim Akter", event: "Acoustic Evenings Live", amount: 70, status: "Paid" },
  { code: "TB-48201", customer: "Sabbir Khan", event: "Electric Beach Festival", amount: 120, status: "Failed" },
];

const STATUS_TONE = {
  Paid: "success",
  Pending: "warning",
  Refunded: "neutral",
  Failed: "danger",
} as const;

/* ------------------------------------------------------------------ */

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

const last4 = sum(WEEKLY_REVENUE.slice(-4));
const prev4 = sum(WEEKLY_REVENUE.slice(-8, -4));
const revenueDelta = ((last4 - prev4) / prev4) * 100;

const STATS: { label: string; value: string; delta: number; hint: string; icon: LucideIcon }[] = [
  { label: "Revenue", value: usd.format(last4), delta: revenueDelta, hint: "vs previous 4 weeks", icon: Wallet },
  { label: "Tickets sold", value: "1,284", delta: 8.1, hint: "vs previous 4 weeks", icon: Ticket },
  { label: "Active events", value: "36", delta: 5.9, hint: "vs previous 4 weeks", icon: CalendarDays },
  { label: "New users", value: "312", delta: -2.3, hint: "vs previous 4 weeks", icon: UserPlus },
];

export function AdminOverview() {
  return (
    <div className="space-y-6">
      <section aria-label="Key numbers" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Revenue"
          subtitle="Last 12 weeks"
          aside={<span className="text-sm font-semibold tabular-nums">{usd.format(sum(WEEKLY_REVENUE))}</span>}
        >
          <RevenueChart data={WEEKLY_REVENUE} />
        </Panel>

        <Panel title="Upcoming events" subtitle="Next on the calendar" action={{ href: "/admin/events", label: "View all" }}>
          <ul className="divide-y divide-fg/10">
            {EVENTS.slice(0, 4).map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-fg/10">
                  <Image src={e.image} alt="" fill sizes="56px" unoptimized className="object-cover" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{e.title}</p>
                  <p className="truncate text-xs text-fg/55">{e.location}</p>
                  <p className="mt-0.5 text-xs text-fg/55 tabular-nums">{e.going.toLocaleString("en-US")} going</p>
                </div>
                <div className="shrink-0 rounded-xl bg-fg/10 px-2.5 py-1.5 text-center leading-tight">
                  <p className="text-base font-bold tabular-nums">{e.day}</p>
                  <p className="text-xs text-fg/60">{e.month}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Recent bookings" subtitle="Latest tickets across all events" action={{ href: "/admin/bookings", label: "View all" }} flush>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-fg/10 text-fg/50">
                <th scope="col" className="px-5 py-3 font-medium">Booking</th>
                <th scope="col" className="px-5 py-3 font-medium">Customer</th>
                <th scope="col" className="px-5 py-3 font-medium">Event</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Amount</th>
                <th scope="col" className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fg/10">
              {RECENT_BOOKINGS.map((b) => (
                <tr key={b.code} className="hover:bg-fg/5">
                  <td className="px-5 py-3.5 font-semibold tabular-nums">{b.code}</td>
                  <td className="px-5 py-3.5">{b.customer}</td>
                  <td className="max-w-64 truncate px-5 py-3.5 text-fg/70">{b.event}</td>
                  <td className="px-5 py-3.5 text-right font-medium tabular-nums">{usd.format(b.amount)}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge label={b.status} tone={STATUS_TONE[b.status]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------ pieces ------------------------------ */

function StatCard({ label, value, delta, hint, icon: Icon }: (typeof STATS)[number]) {
  const up = delta >= 0;
  const Trend = up ? TrendingUp : TrendingDown;
  return (
    <div className="rounded-2xl border border-fg/10 bg-panel/60 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-fg/60">{label}</p>
        <span className="grid size-9 place-items-center rounded-xl bg-fg/10">
          <Icon aria-hidden className="size-[18px] text-fg/80" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight tabular-nums">{value}</p>
      <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-1 font-semibold",
            up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
          )}
        >
          <Trend aria-hidden className="size-3.5" />
          {up ? "+" : "-"}
          {Math.abs(delta).toFixed(1)}%
        </span>
        <span className="text-fg/50">{hint}</span>
      </p>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  aside,
  action,
  flush,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  aside?: React.ReactNode;
  action?: { href: string; label: string };
  flush?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-2xl border border-fg/10 bg-panel/60", className)}>
      <header className="flex items-start justify-between gap-4 p-5 pb-4">
        <div>
          <h2 className="text-base font-bold">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-fg/55">{subtitle}</p>}
        </div>
        {aside}
        {action && (
          <Link href={action.href} className="text-sm font-semibold text-coral hover:underline focus-visible:outline-2 focus-visible:outline-coral">
            {action.label}
          </Link>
        )}
      </header>
      <div className={flush ? "pb-2" : "px-5 pb-5"}>{children}</div>
    </section>
  );
}

/** Smooth gradient area chart (library ছাড়া, শুধু SVG)। */
function RevenueChart({ data }: { data: number[] }) {
  const W = 640;
  const H = 240;
  const padX = 10;
  const padTop = 16;
  const padBottom = 10;
  const max = Math.ceil(Math.max(...data) / 2000) * 2000;

  const pts: [number, number][] = data.map((v, i) => [
    padX + (i / (data.length - 1)) * (W - padX * 2),
    H - padBottom - (v / max) * (H - padTop - padBottom),
  ]);

  // Catmull-Rom থেকে cubic bezier: রেখাটা নরম বাঁকা হয়
  let line = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    line += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]}`;
  }
  const area = `${line} L ${pts[pts.length - 1][0]} ${H} L ${pts[0][0]} ${H} Z`;
  const [lx, ly] = pts[pts.length - 1];

  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Weekly revenue for the last ${data.length} weeks, rising from ${usd.format(data[0])} to ${usd.format(data[data.length - 1])}`}
        className="h-auto w-full overflow-visible"
      >
        <defs>
          <linearGradient id="rev-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-magenta)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-magenta)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rev-line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--color-violet)" />
            <stop offset="55%" stopColor="var(--color-magenta)" />
            <stop offset="100%" stopColor="var(--color-coral)" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = H - padBottom - t * (H - padTop - padBottom);
          return (
            <line key={t} x1={0} x2={W} y1={y} y2={y} stroke="currentColor" strokeOpacity={0.1} strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
          );
        })}

        <path d={area} fill="url(#rev-fill)" />
        <path d={line} fill="none" stroke="url(#rev-line)" strokeWidth={3} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <circle cx={lx} cy={ly} r={5} fill="var(--color-bg)" stroke="var(--color-coral)" strokeWidth={3} />
      </svg>

      <figcaption className="mt-3 flex justify-between text-xs text-fg/50">
        <span>12 weeks ago</span>
        <span>This week: {usd.format(data[data.length - 1])}</span>
      </figcaption>
    </figure>
  );
}

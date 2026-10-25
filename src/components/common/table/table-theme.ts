/**
 * DataTable এর সব রং এক জায়গায়। অন্য project এ নিলে শুধু এই ফাইল বদলান।
 * লাগে: --fg, --panel (globals.css), coral (accent), btn-grad (active page), red-500 (delete)
 */
export const tableTheme = {
  card: "overflow-hidden rounded-3xl border border-fg/15 bg-panel/40",
  divider: "border-fg/10",
  headRow: "border-fg/10 bg-fg/5 hover:bg-fg/5",
  head: "h-12 px-4 text-xs font-semibold uppercase tracking-wide text-fg/60",
  row: "border-fg/10 hover:bg-fg/5",
  cell: "px-4 py-3.5",
  muted: "text-fg/60",
  control:
    "h-10 rounded-full border border-fg/15 bg-fg/5 px-4 text-sm outline-none transition placeholder:text-fg/40 focus:border-coral",
  pageBtn:
    "grid h-9 min-w-9 cursor-pointer place-items-center rounded-full px-3 text-sm font-medium transition hover:bg-fg/10 disabled:pointer-events-none disabled:opacity-40",
  pageBtnActive: "btn-grad hover:opacity-90",
  actionBase:
    "grid size-9 cursor-pointer place-items-center rounded-full text-fg/60 transition focus-visible:outline-2 focus-visible:outline-coral disabled:pointer-events-none disabled:opacity-40",
  actionView: "hover:bg-fg/10 hover:text-fg",
  actionEdit: "hover:bg-coral/15 hover:text-coral",
  actionDelete: "hover:bg-red-500/15 hover:text-red-500",
  dialog: "cursor-default rounded-3xl bg-panel p-6 ring-fg/15 pretty-scroll ",
  accent: "text-coral",
} as const;

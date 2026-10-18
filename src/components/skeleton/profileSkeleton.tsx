export function ProfileSkeleton() {
  return (
    <div
      className="grid gap-6 lg:grid-cols-[20rem_1fr]"
      aria-busy="true"
      aria-label="Loading profile"
    >
      <div className="h-80 animate-pulse rounded-3xl bg-fg/10" />
      <div className="h-80 animate-pulse rounded-3xl bg-fg/10" />
    </div>
  );
}
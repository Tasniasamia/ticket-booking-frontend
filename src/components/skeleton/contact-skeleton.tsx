import { ContactBlockSkeleton, PageTitleSkeleton } from "./sections";

export function ContactSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading">
      <PageTitleSkeleton />
      <ContactBlockSkeleton />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

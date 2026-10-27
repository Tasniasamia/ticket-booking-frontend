import { Skeleton } from "@/components/ui/skeleton";

export function PaymentSkeleton() {
  return (
    <div className="glass mx-auto w-full max-w-xl rounded-4xl p-6 sm:p-10">
      <Skeleton className="mx-auto size-20 rounded-full" />
      <Skeleton className="mx-auto mt-6 h-9 w-2/3" />
      <Skeleton className="mx-auto mt-4 h-4 w-4/5" />
      <Skeleton className="mt-8 h-28 w-full rounded-3xl" />
    </div>
  );
}

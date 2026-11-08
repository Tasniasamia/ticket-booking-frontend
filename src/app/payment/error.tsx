"use client";

import { AlertTriangle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl border border-fg/15 bg-panel/50 p-8 text-center"
    >
      <AlertTriangle aria-hidden className="size-8 text-coral" />
      <h2 className="text-lg font-bold">Something went wrong</h2>
      <p className="text-sm text-fg/60">
        {error.message || "This page could not be loaded."} Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="btn-grad cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-coral"
      >
        Try again
      </button>
    </div>
  );
}

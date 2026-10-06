import { Skeleton } from "@/components/ui/feedback";

export default function Loading() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 sm:px-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-5 h-12 w-full max-w-xl" />
      <Skeleton className="mt-3 h-12 w-2/3 max-w-md" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Skeleton className="h-44" />
        <Skeleton className="h-44" />
        <Skeleton className="h-44" />
      </div>
    </div>
  );
}

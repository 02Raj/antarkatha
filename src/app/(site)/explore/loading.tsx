import { Skeleton } from "@/components/ui/feedback";

export default function ExploreLoading() {
  return (
    <div className="mx-auto max-w-content px-5 py-14 sm:px-8" aria-busy="true">
      <span className="sr-only">Loading the library…</span>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-6 h-40 w-full" />
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}

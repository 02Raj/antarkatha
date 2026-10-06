"use client";

import { ErrorPanel } from "@/components/feedback/error-panel";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorPanel digest={error.digest} onRetry={reset} />;
}

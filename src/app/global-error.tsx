"use client";

import "./globals.css";
import { ErrorPanel } from "@/components/feedback/error-panel";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <main id="main">
          <ErrorPanel digest={error.digest} onRetry={reset} />
        </main>
      </body>
    </html>
  );
}

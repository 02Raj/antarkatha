"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { LampMark } from "@/components/motifs";

type ErrorPanelProps = {
  title?: string;
  message?: string;
  digest?: string;
  onRetry?: () => void;
};

export function ErrorPanel({
  title = "Something interrupted the page.",
  message = "It’s not you. Try again, and if it keeps happening, let us know from the contact page.",
  digest,
  onRetry,
}: ErrorPanelProps) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center px-5 py-20 text-center"
    >
      <LampMark className="size-16" />
      <h1 className="mt-6 text-3xl text-ink">{title}</h1>
      <p className="mt-3 text-ink-muted">{message}</p>
      {digest ? <p className="mt-2 font-mono text-xs text-ink-muted">Reference: {digest}</p> : null}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {onRetry ? <Button onClick={onRetry}>Try again</Button> : null}
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Back to home
        </Link>
      </div>
    </div>
  );
}

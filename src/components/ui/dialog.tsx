"use client";

import * as React from "react";
import { Dialog as D } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;

type ContentProps = React.ComponentProps<typeof D.Content> & {
  title: string;
  description?: string;
  hideTitle?: boolean;
  side?: "center" | "right";
};

export function DialogContent({
  className,
  children,
  title,
  description,
  hideTitle,
  side = "center",
  ...props
}: ContentProps) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-ink/35 data-[state=open]:animate-fade-in" />
      <D.Content
        className={cn(
          "fixed z-50 border border-copper/50 bg-surface text-ink shadow-[0_24px_60px_-30px_rgb(28_25_21/0.45)] focus:outline-none",
          side === "center" &&
            "top-1/2 left-1/2 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 sm:p-8",
          side === "right" &&
            "inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col rounded-l-xl p-6",
          "motion-safe:data-[state=open]:animate-fade-up",
          className,
        )}
        {...props}
      >
        <D.Title className={cn("pr-8 font-serif text-2xl text-ink", hideTitle && "sr-only")}>
          {title}
        </D.Title>
        {description ? (
          <D.Description className="mt-2 text-[0.9375rem] text-ink-muted">
            {description}
          </D.Description>
        ) : (
          <D.Description className="sr-only">{title}</D.Description>
        )}
        {children}
        <D.Close
          className="absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-md text-ink-muted hover:bg-paper-deep hover:text-ink"
          aria-label="Close"
        >
          <X className="size-4" aria-hidden="true" />
        </D.Close>
      </D.Content>
    </D.Portal>
  );
}

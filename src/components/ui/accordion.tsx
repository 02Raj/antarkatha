"use client";

import * as React from "react";
import { Accordion as A } from "radix-ui";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = A.Root;

export function AccordionItem({ className, ...props }: React.ComponentProps<typeof A.Item>) {
  return <A.Item className={cn("hairline border-b", className)} {...props} />;
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof A.Trigger>) {
  return (
    <A.Header className="flex">
      <A.Trigger
        className={cn(
          "group flex flex-1 items-start justify-between gap-6 py-5 text-left font-serif text-lg text-ink transition-colors hover:text-forest sm:text-xl",
          className,
        )}
        {...props}
      >
        {children}
        <Plus
          className="mt-1 size-5 shrink-0 text-saffron transition-transform duration-200 group-data-[state=open]:rotate-45"
          aria-hidden="true"
        />
      </A.Trigger>
    </A.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof A.Content>) {
  return (
    <A.Content className="overflow-hidden" {...props}>
      <div
        className={cn("max-w-reading pb-6 text-[0.98rem] leading-relaxed text-ink-soft", className)}
      >
        {children}
      </div>
    </A.Content>
  );
}

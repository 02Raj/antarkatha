import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-md border border-copper/70 bg-surface px-3.5 text-[0.9375rem] text-ink placeholder:text-ink-muted/80 transition-colors duration-200 hover:border-copper focus-visible:border-forest focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-forest disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger";

export function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return <input type={type} className={cn(fieldBase, "h-11", className)} {...props} />;
}

export function Textarea({ className, rows = 5, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      rows={rows}
      className={cn(fieldBase, "py-2.5 leading-relaxed", className)}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <span className="relative block">
      <select className={cn(fieldBase, "h-11 appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-muted"
        aria-hidden="true"
      />
    </span>
  );
}

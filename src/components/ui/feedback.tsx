import * as React from "react";
import { cn } from "@/lib/utils";
import { InwardCircles } from "@/components/motifs";

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-paper-deep motion-reduce:animate-none", className)}
      {...props}
    />
  );
}

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed border-copper/70 bg-surface/60 px-6 py-12 text-center",
        className,
      )}
    >
      <InwardCircles className="mb-5 size-16" />
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      {description ? <p className="mt-2 max-w-md text-ink-muted">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

type NoticeProps = {
  tone?: "info" | "warning" | "danger" | "success";
  title?: string;
  children: React.ReactNode;
  className?: string;
};

const noticeTone = {
  info: "border-forest/25 bg-forest-wash/60 text-forest-deep",
  success: "border-forest/25 bg-forest-wash text-forest-deep",
  warning: "border-saffron/30 bg-saffron-wash/70 text-saffron-ink",
  danger: "border-danger/30 bg-danger-wash text-danger",
};

export function Notice({ tone = "info", title, children, className }: NoticeProps) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "rounded-lg border px-4 py-3 text-sm leading-relaxed",
        noticeTone[tone],
        className,
      )}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={cn(title && "mt-0.5")}>{children}</div>
    </div>
  );
}

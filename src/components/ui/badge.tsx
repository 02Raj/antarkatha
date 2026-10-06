import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-sans text-xs leading-5 font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "border-copper/60 bg-surface text-ink-soft",
        saffron: "border-transparent bg-saffron-wash text-saffron-ink",
        forest: "border-transparent bg-forest-wash text-forest-deep",
        danger: "border-transparent bg-danger-wash text-danger",
        ink: "border-transparent bg-ink text-paper",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

const statusTone: Record<string, BadgeProps["tone"]> = {
  published: "forest",
  active: "forest",
  paid: "forest",
  approved: "forest",
  resolved: "forest",
  scheduled: "saffron",
  in_review: "saffron",
  pending: "saffron",
  created: "saffron",
  new: "saffron",
  draft: "neutral",
  archived: "neutral",
  closed: "neutral",
  failed: "danger",
  changes_requested: "danger",
  source_review_pending: "danger",
};

/** Admin status pill; maps any known status string to a tone and readable label. */
export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const label = status.replace(/_/g, " ");
  return (
    <Badge tone={statusTone[status] ?? "neutral"} className={cn("capitalize", className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </Badge>
  );
}

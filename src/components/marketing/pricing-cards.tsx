import Link from "next/link";
import { formatPaise } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CatalogPlan } from "@/lib/catalog/types";

export function PricingCards({ plans }: { plans: CatalogPlan[] }) {
  return (
    <ul className="grid gap-5 lg:grid-cols-3">
      {plans.map((plan) => {
        const featured = plan.code === "founding_monthly";
        const href = plan.code === "free" ? "/daily" : "/signup?next=/pricing";
        const cta = plan.code === "free" ? "Begin with today’s lesson" : "Create an account";
        const price =
          plan.pricePaise === 0
            ? "₹0"
            : `${formatPaise(plan.pricePaise, plan.currency)}${plan.billingInterval === "month" ? " / month" : plan.billingInterval === "year" ? " / year" : ""}`;
        return (
          <li
            key={plan.id}
            className={cn(
              "flex flex-col rounded-xl border p-6",
              featured
                ? "border-forest bg-forest text-surface"
                : "hairline border-copper/60 bg-surface",
            )}
          >
            <h3 className={cn("font-serif text-2xl", featured ? "text-surface" : "text-ink")}>
              {plan.name}
            </h3>
            <p
              className={cn(
                "mt-2 text-3xl font-medium",
                featured ? "text-copper-soft" : "text-saffron-ink",
              )}
            >
              {price}
            </p>
            <p
              className={cn(
                "mt-3 text-sm leading-relaxed",
                featured ? "text-surface/80" : "text-ink-muted",
              )}
            >
              {plan.description}
            </p>
            <ul
              className={cn(
                "mt-6 flex-1 space-y-2 text-sm",
                featured ? "text-surface/90" : "text-ink-soft",
              )}
            >
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Link
              href={href}
              className={cn(
                buttonVariants({ variant: featured ? "outline" : "primary" }),
                "mt-8",
                featured && "border-copper bg-transparent text-surface hover:bg-forest-deep",
              )}
            >
              {cta}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

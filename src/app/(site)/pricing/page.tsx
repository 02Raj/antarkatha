import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { listPlans } from "@/lib/catalog/queries";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { Container, SectionHeading } from "@/components/ui/layout";
import { FAQAccordion } from "@/components/marketing/faq-accordion";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Free daily lesson, founding membership at ₹99 a month, or ₹799 a year. Launch placeholders, editable from admin.",
  path: "/pricing",
});

export default async function PricingPage() {
  const { data: plans } = await listPlans();
  return (
    <Container className="py-14">
      <SectionHeading
        as="h1"
        eyebrow="Membership"
        title="Pay for the library, not for the first pause"
        description="Today’s lesson stays open. Founding prices are launch placeholders and can be changed from the editorial desk. Checkout arrives in a later phase — creating an account is the next real step."
      />
      <div className="mt-12">
        <PricingCards plans={plans} />
      </div>
      <p className="mt-8 max-w-reading text-sm text-ink-muted">
        Refunds follow the{" "}
        <Link href="/refund-policy" className="link-quiet text-forest">
          refund policy
        </Link>
        . There is no lifetime plan at launch.
      </p>
      <div className="mt-16">
        <h2 className="text-2xl">Questions about paying</h2>
        <div className="mt-6">
          <FAQAccordion />
        </div>
      </div>
    </Container>
  );
}

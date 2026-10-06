import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { Container, SectionHeading } from "@/components/ui/layout";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "Terms of use",
  description: "How you may use AntarKatha, and the limits of our adaptations.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <Container width="reading" className="py-14">
      <SectionHeading as="h1" eyebrow="Policy" title="Terms of use" />
      <div className="prose-reading mt-8 space-y-5">
        <p>
          AntarKatha offers original adaptations for personal reading and listening. You may not
          republish lesson bodies as if they were our translations of a scripture, or scrape the
          library for a competing product.
        </p>
        <p>
          Accounts are for one person. Do not attempt to change your role from the browser. Paid
          access, when enabled, follows the{" "}
          <Link href="/refund-policy" className="link-quiet text-forest">
            refund policy
          </Link>
          .
        </p>
        <p>These terms will be updated if membership checkout goes live.</p>
      </div>
    </Container>
  );
}

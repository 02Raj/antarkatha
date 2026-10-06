import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { Container, SectionHeading } from "@/components/ui/layout";

export const metadata: Metadata = pageMetadata({
  title: "Refund policy",
  description: "How refunds will work when membership payments are enabled.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <Container width="reading" className="py-14">
      <SectionHeading as="h1" eyebrow="Policy" title="Refunds" />
      <div className="prose-reading mt-8 space-y-5">
        <p>
          While checkout is still a development adapter, no live charges are taken. When Razorpay
          (or another provider) is enabled, monthly founding memberships can be cancelled for the
          next period; unused days in the current period are not prorated unless required by law.
        </p>
        <p>
          Annual memberships may be refunded within seven days of first purchase if you have not
          completed more than two member-only lessons. After that, the remaining term is not
          refunded except where Indian consumer law requires it.
        </p>
        <p>Write to the contact desk with the order reference from your email confirmation.</p>
      </div>
    </Container>
  );
}

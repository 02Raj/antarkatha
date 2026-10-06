import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { Container, SectionHeading } from "@/components/ui/layout";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "About and source policy",
  description:
    "How AntarKatha adapts Indian texts, what we refuse to invent, and who this library is for.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container width="reading" className="py-14">
      <SectionHeading
        as="h1"
        eyebrow="Editorial"
        title="A calm desk for difficult books"
        description="AntarKatha is a reading and listening library of short, source-aware adaptations. It is not a debate platform, astrology app, guru marketplace, or chatbot."
      />
      <div className="prose-reading mt-10 space-y-6">
        <h2>Who it is for</h2>
        <p>
          Indians — and anyone reading in English first — who are curious about the Gita, the
          Upanishads, the Mahabharata, and the Ramayana, and who can give five or ten minutes in a
          working day.
        </p>
        <h2>How a lesson is made</h2>
        <p>
          Context, the passage or story, a simple meaning, why it matters today, a reflection, and
          one practice. Then a source block. We would rather leave a locator generic than invent a
          verse number, a translator, or a Sanskrit quotation.
        </p>
        <h2>Source policy</h2>
        <p>
          Adaptations are labelled as adaptations. Demo content in this build is marked “Demo
          adaptation — verify before publishing.” Items missing a reviewed source stay unpublished
          in the live desk.
        </p>
        <p>
          Corrections are welcome from the{" "}
          <Link href="/contact" className="link-quiet text-forest">
            contact page
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}

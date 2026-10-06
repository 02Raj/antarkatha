import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { Container, SectionHeading } from "@/components/ui/layout";
import { ContactForm } from "@/components/contact/contact-form";
import { defaultSiteSettings } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Write to the AntarKatha editorial desk about a lesson, a correction, or the product.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container width="reading" className="py-14">
      <SectionHeading
        as="h1"
        eyebrow="Desk"
        title="Write to us"
        description="Tell us if a source note is wrong, a lesson is unclear, or the site misbehaved. This is an editorial inbox, not a public comments thread."
      />
      <ContactForm email={defaultSiteSettings.contactEmail} />
    </Container>
  );
}

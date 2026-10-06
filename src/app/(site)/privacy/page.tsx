import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { Container, SectionHeading } from "@/components/ui/layout";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "What AntarKatha stores, what we do not put in analytics, and how to reach us.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Container width="reading" className="py-14">
      <SectionHeading as="h1" eyebrow="Policy" title="Privacy" />
      <div className="prose-reading mt-8 space-y-5">
        <p>
          We store an account email, a display name, reading and listening progress, bookmarks, and
          the preferences you set. Analytics events record that a lesson was opened or audio was
          started — never the body of the lesson.
        </p>
        <p>
          Authentication cookies are essential to signed-in use. We do not add a cookie banner for
          cookies that are not strictly needed, because we do not currently set non-essential
          marketing cookies.
        </p>
        <p>
          Hosted data lives with Supabase. Payment details, when checkout is enabled, will be
          handled by the payment provider — not stored as card numbers on AntarKatha.
        </p>
      </div>
    </Container>
  );
}

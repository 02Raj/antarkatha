import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui/layout";
import { EmptyState } from "@/components/ui/feedback";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Saved lessons" };

export default function BookmarksPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        as="h1"
        eyebrow="Library"
        title="Saved for later"
        description="Bookmarks will sync here in Phase 4. Until then, the open daily lesson is the surest place to return."
      />
      <EmptyState
        className="mt-10"
        title="Nothing saved yet"
        description="Open a lesson you want to keep, or begin with today."
        action={
          <Link href="/daily" className={buttonVariants()}>
            Today’s reading
          </Link>
        }
      />
    </Container>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui/layout";
import { EmptyState } from "@/components/ui/feedback";
import { buttonVariants } from "@/components/ui/button";
import { LessonCard } from "@/components/catalog/lesson-card";
import { BrowserSaves } from "@/components/reader/browser-saves";
import { listSavedLessons } from "@/lib/engagement/queries";

export const metadata: Metadata = { title: "Saved lessons" };

export default async function BookmarksPage() {
  const lessons = await listSavedLessons();
  return (
    <Container className="py-16">
      <SectionHeading
        as="h1"
        eyebrow="Library"
        title="Saved for later"
        description="Lessons you keep from the reader. They stay with this account."
      />
      {lessons.length === 0 ? (
        <EmptyState
          className="mt-10"
          title="Nothing saved yet"
          description="Open a lesson and choose Save. Guests can sign in from the reader so the lesson follows them."
          action={
            <Link href="/daily" className={buttonVariants()}>
              Today’s reading
            </Link>
          }
        />
      ) : (
        <ol className="mt-10 space-y-4">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <LessonCard lesson={lesson} />
            </li>
          ))}
        </ol>
      )}
      <BrowserSaves knownIds={lessons.map((lesson) => lesson.id)} />
    </Container>
  );
}

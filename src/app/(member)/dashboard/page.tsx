import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui/layout";
import { buttonVariants } from "@/components/ui/button";
import { getViewer } from "@/lib/auth/viewer";
import { getPracticeSummary } from "@/lib/engagement/queries";
import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Your practice" };

export default async function DashboardPage() {
  const viewer = await getViewer();
  const practice = await getPracticeSummary();

  return (
    <Container className="py-16">
      <SectionHeading
        as="h1"
        eyebrow="Dashboard"
        title={viewer?.displayName ? `${viewer.displayName}’s practice` : "Your practice"}
        description="A streak is a reminder to return, not a score."
      />
      <dl className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="hairline rounded-xl border bg-surface p-5">
          <dt className="text-sm text-ink-muted">Current streak</dt>
          <dd className="mt-2 font-serif text-3xl">{practice.currentStreak}</dd>
        </div>
        <div className="hairline rounded-xl border bg-surface p-5">
          <dt className="text-sm text-ink-muted">Longest streak</dt>
          <dd className="mt-2 font-serif text-3xl">{practice.longestStreak}</dd>
        </div>
        <div className="hairline rounded-xl border bg-surface p-5">
          <dt className="text-sm text-ink-muted">Saved lessons</dt>
          <dd className="mt-2 font-serif text-3xl">{practice.savedCount}</dd>
        </div>
      </dl>
      {practice.continueLesson ? (
        <p className="mt-8 max-w-reading text-ink-soft">
          Continue{" "}
          <Link href={`/read/${practice.continueLesson.slug}`} className="link-quiet text-forest">
            {practice.continueLesson.title}
          </Link>{" "}
          — {Math.round(practice.continueLesson.progressPercent)}% read.
        </p>
      ) : (
        <p className="mt-8 max-w-reading text-ink-muted">
          No unfinished lesson on this account yet. Begin with today, and progress will appear here.
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/daily" className={buttonVariants()}>
          Today’s lesson
        </Link>
        <Link href="/bookmarks" className={buttonVariants({ variant: "outline" })}>
          Saved lessons
        </Link>
        <Link href="/explore" className={buttonVariants({ variant: "outline" })}>
          Explore the library
        </Link>
        <Link href="/settings" className={buttonVariants({ variant: "quiet" })}>
          Settings
        </Link>
        <form action={signOut}>
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>
    </Container>
  );
}

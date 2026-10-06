import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Notice } from "@/components/ui/feedback";
import { StructuredContentRenderer } from "@/components/content/structured-content-renderer";
import { Badge } from "@/components/ui/badge";
import { formatMinutes } from "@/lib/utils";
import type { CatalogLesson } from "@/lib/catalog/types";

export function PaywallPanel({ lesson }: { lesson: CatalogLesson }) {
  return (
    <div className="mt-10">
      <StructuredContentRenderer blocks={lesson.previewBlocks} />
      <div className="mt-10 rounded-xl border border-copper/70 bg-paper-deep/60 px-6 py-8">
        <p className="eyebrow">The rest of this lesson</p>
        <h2 className="mt-3 text-2xl">Continue with a founding membership</h2>
        <p className="mt-3 max-w-reading text-ink-muted">
          You have a useful preview. Today’s featured lesson stays open without paying. The full
          library — including this page — is for founding members.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/pricing" className={buttonVariants()}>
            See membership
          </Link>
          <Link href="/daily" className={buttonVariants({ variant: "outline" })}>
            Read today’s open lesson
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PublicLesson({
  lesson,
  canReadFull,
  previousSlug,
  nextSlug,
}: {
  lesson: CatalogLesson;
  canReadFull: boolean;
  previousSlug?: string;
  nextSlug?: string;
}) {
  return (
    <article className="mx-auto max-w-reading px-5 py-12 sm:px-8">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-muted">
        <Link href="/explore" className="link-quiet">
          Library
        </Link>
        <span aria-hidden="true"> · </span>
        <Link href={`/collections/${lesson.collectionSlug}`} className="link-quiet">
          {lesson.collectionTitle}
        </Link>
      </nav>
      <p className="eyebrow mt-6">{lesson.collectionTitle}</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">{lesson.title}</h1>
      {lesson.subtitle ? (
        <p className="mt-3 font-serif text-xl text-ink-muted italic">{lesson.subtitle}</p>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <Badge>{formatMinutes(lesson.readingMinutes)}</Badge>
        <Badge tone="saffron" className="capitalize">
          {lesson.difficulty}
        </Badge>
        <Badge tone={lesson.accessTier === "free" ? "forest" : "neutral"}>
          {lesson.accessTier === "free" ? "Open" : "Members"}
        </Badge>
      </div>
      <Notice className="mt-6" title="Source">
        {lesson.sourceTitle ?? "Source review pending"}. {lesson.sourceLocator}.{" "}
        {lesson.adaptationNote}
      </Notice>
      <p className="mt-4 text-sm text-ink-muted">
        {lesson.hasAudio ? "Audio is available on this lesson." : "Audio coming soon."}
      </p>
      {canReadFull ? (
        <div className="mt-10">
          <StructuredContentRenderer blocks={lesson.body} />
        </div>
      ) : (
        <PaywallPanel lesson={lesson} />
      )}
      <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-copper/40 pt-6 text-sm">
        {previousSlug ? (
          <Link href={`/read/${previousSlug}`} className="link-quiet">
            Previous lesson
          </Link>
        ) : (
          <span />
        )}
        {nextSlug ? (
          <Link href={`/read/${nextSlug}`} className="link-quiet">
            Next lesson
          </Link>
        ) : null}
      </div>
    </article>
  );
}

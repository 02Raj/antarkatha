import Link from "next/link";
import { Headphones } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatMinutes } from "@/lib/utils";
import type { CatalogLesson } from "@/lib/catalog/types";
import { parseContentBlocks } from "@/lib/content/blocks";

export function LessonPreview({ lesson }: { lesson: CatalogLesson }) {
  const extract = parseContentBlocks(lesson.previewBlocks)[0];
  const extractText = extract && "text" in extract ? extract.text : lesson.summary;

  return (
    <section aria-labelledby="preview-heading" className="mx-auto max-w-content px-5 py-6 sm:px-8">
      <div className="grid overflow-hidden rounded-xl border border-copper/60 bg-surface lg:grid-cols-[1.2fr_0.8fr]">
        <div className="p-6 sm:p-10">
          <p className="eyebrow">A realistic lesson</p>
          <h2 id="preview-heading" className="mt-3 text-3xl sm:text-4xl">
            {lesson.title}
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <Badge tone="forest">{lesson.collectionTitle}</Badge>
            <span>{formatMinutes(lesson.readingMinutes)}</span>
            <span className="capitalize">{lesson.difficulty}</span>
          </div>
          <p className="prose-reading mt-6 max-w-reading">{extractText}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={`/read/${lesson.slug}`} className={buttonVariants()}>
              Continue this reading
            </Link>
            <Link href={`/read/${lesson.slug}`} className={buttonVariants({ variant: "outline" })}>
              <Headphones className="size-4" aria-hidden="true" />
              {lesson.hasAudio ? "Listen" : "Audio coming soon"}
            </Link>
          </div>
        </div>
        <aside className="border-t border-copper/50 bg-paper-deep/50 p-6 sm:p-10 lg:border-t-0 lg:border-l">
          <p className="eyebrow">Takeaway</p>
          <p className="mt-3 font-serif text-xl leading-snug text-ink">
            Name what is shaking. Return to the one duty that is actually in your hands.
          </p>
          <p className="mt-4 text-sm text-ink-muted">
            Source is named on the lesson page. This is an adaptation, not a translation.
          </p>
        </aside>
      </div>
    </section>
  );
}

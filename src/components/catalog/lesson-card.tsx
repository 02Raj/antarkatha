import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatMinutes } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { CatalogLesson } from "@/lib/catalog/types";

export function LessonCard({
  lesson,
  variant = "standard",
}: {
  lesson: CatalogLesson;
  variant?: "standard" | "featured" | "compact";
}) {
  return (
    <article
      className={cn(
        "flex flex-col bg-surface",
        variant === "featured" && "hairline rounded-xl border p-6 sm:p-8",
        variant === "standard" && "hairline rounded-lg border p-5",
        variant === "compact" && "border-b border-copper/40 py-5 last:border-b-0",
      )}
    >
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge tone={lesson.accessTier === "free" ? "forest" : "saffron"}>
          {lesson.accessTier === "free" ? "Open lesson" : "Members"}
        </Badge>
        <Link href={`/collections/${lesson.collectionSlug}`} className="link-quiet text-ink-muted">
          {lesson.collectionTitle}
        </Link>
        <span className="text-ink-muted">{formatMinutes(lesson.readingMinutes)}</span>
      </div>
      <h3 className={cn("mt-3 text-ink", variant === "featured" ? "text-3xl" : "text-xl")}>
        <Link href={`/read/${lesson.slug}`} className="hover:text-forest">
          {lesson.title}
        </Link>
      </h3>
      {lesson.subtitle && variant !== "compact" ? (
        <p className="mt-1 font-serif text-ink-muted italic">{lesson.subtitle}</p>
      ) : null}
      <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">{lesson.summary}</p>
      <p className="mt-4 font-sans text-sm">
        <Link href={`/read/${lesson.slug}`} className="link-quiet text-forest">
          {lesson.accessTier === "free" ? "Read the lesson" : "Read the preview"}
        </Link>
      </p>
    </article>
  );
}

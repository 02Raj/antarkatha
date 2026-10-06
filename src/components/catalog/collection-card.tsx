import Link from "next/link";
import { InwardCircles, LeafLine, RiverLine } from "@/components/motifs";
import { cn } from "@/lib/utils";
import type { CatalogCollection } from "@/lib/catalog/types";

export function CollectionCard({
  collection,
  lessonCount,
  layout = "regular",
}: {
  collection: CatalogCollection;
  lessonCount: number;
  layout?: "regular" | "wide" | "tall";
}) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-xl border bg-surface",
        "hairline",
        layout === "wide" && "md:col-span-2",
        layout === "tall" && "md:row-span-2",
      )}
    >
      <div className="absolute inset-y-0 left-0 w-1.5 bg-copper/70" aria-hidden="true" />
      <div className="p-6 sm:p-8">
        <p className="eyebrow">{collection.shortTitle}</p>
        <h3 className={cn("mt-3 text-ink", layout === "wide" ? "text-4xl" : "text-2xl")}>
          <Link href={`/collections/${collection.slug}`} className="hover:text-forest">
            {collection.title}
          </Link>
        </h3>
        <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-ink-muted">
          {collection.description}
        </p>
        <p className="mt-5 text-sm text-ink-soft">
          {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"} ·{" "}
          <Link href={`/collections/${collection.slug}`} className="link-quiet text-forest">
            Open the collection
          </Link>
        </p>
      </div>
      <div className="pointer-events-none absolute right-[-8%] bottom-[-18%] opacity-70">
        {collection.coverMotif === "leaf" ? (
          <LeafLine className="size-28" />
        ) : collection.coverMotif === "river" ? (
          <RiverLine className="h-16 w-48" />
        ) : (
          <InwardCircles className="size-36" />
        )}
      </div>
    </article>
  );
}

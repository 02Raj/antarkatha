import Link from "next/link";
import { exploreQueryString, type ExploreFilters } from "@/lib/catalog/filter";
import type { CatalogCollection, CatalogTopic } from "@/lib/catalog/types";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchAndFiltersProps = {
  filters: ExploreFilters;
  collections: CatalogCollection[];
  topics: CatalogTopic[];
};

export function SearchAndFilters({ filters, collections, topics }: SearchAndFiltersProps) {
  return (
    <form
      method="get"
      action="/explore"
      className="hairline rounded-xl border bg-surface p-5 sm:p-6"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1.5 md:col-span-2">
          <span className="text-sm font-medium">Search</span>
          <Input
            name="q"
            defaultValue={filters.q}
            placeholder="Title, summary, or a word you are carrying"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Collection</span>
          <Select name="collection" defaultValue={filters.collection}>
            <option value="">All collections</option>
            {collections.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.title}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Life situation</span>
          <Select name="topic" defaultValue={filters.topic}>
            <option value="">All topics</option>
            {topics.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.title}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Type</span>
          <Select name="type" defaultValue={filters.type}>
            <option value="">Any type</option>
            <option value="lesson">Lesson</option>
            <option value="primer">Primer</option>
            <option value="commentary">Commentary</option>
            <option value="story">Story</option>
          </Select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Length</span>
          <Select name="duration" defaultValue={filters.duration}>
            <option value="">Any length</option>
            <option value="short">Short (≤ 5 min)</option>
            <option value="medium">Medium (6–8 min)</option>
            <option value="long">Longer (9+ min)</option>
          </Select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Difficulty</span>
          <Select name="difficulty" defaultValue={filters.difficulty}>
            <option value="">Any</option>
            <option value="introductory">Introductory</option>
            <option value="familiar">Familiar</option>
            <option value="deep">Deep</option>
          </Select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Access</span>
          <Select name="access" defaultValue={filters.access}>
            <option value="">Free and members</option>
            <option value="free">Open lessons</option>
            <option value="premium">Members</option>
          </Select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Sort</span>
          <Select name="sort" defaultValue={filters.sort}>
            <option value="recommended">Recommended</option>
            <option value="newest">Newest</option>
            <option value="shortest">Shortest</option>
            <option value="collection">Collection order</option>
          </Select>
        </label>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button type="submit">Apply filters</Button>
        <Link
          href="/explore"
          className="inline-flex h-11 items-center text-sm text-forest underline-offset-4 hover:underline"
        >
          Clear
        </Link>
      </div>
    </form>
  );
}

export function Pagination({
  page,
  totalPages,
  filters,
}: {
  page: number;
  totalPages: number;
  filters: ExploreFilters;
}) {
  if (totalPages <= 1) return null;
  const prev = page > 1 ? exploreQueryString({ ...filters, page: page - 1 }) : null;
  const next = page < totalPages ? exploreQueryString({ ...filters, page: page + 1 }) : null;
  return (
    <nav aria-label="Lesson pages" className="mt-10 flex items-center justify-between">
      {prev ? (
        <Link href={`/explore${prev}`} className="link-quiet">
          Previous
        </Link>
      ) : (
        <span className="text-ink-muted">Previous</span>
      )}
      <p className="text-sm text-ink-muted">
        Page {page} of {totalPages}
      </p>
      {next ? (
        <Link href={`/explore${next}`} className="link-quiet">
          Next
        </Link>
      ) : (
        <span className="text-ink-muted">Next</span>
      )}
    </nav>
  );
}

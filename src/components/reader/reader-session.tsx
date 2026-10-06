"use client";

import * as React from "react";
import Link from "next/link";
import { saveReadingProgress, toggleBookmark } from "@/lib/engagement/actions";
import {
  BOOKMARK_KEY,
  PROGRESS_KEY,
  parseLocalBookmarks,
  parseLocalProgress,
  toggleLocalBookmark,
  upsertLocalProgress,
  type LocalLessonProgress,
} from "@/lib/engagement/local";
import type { ReaderFont, ReaderTheme } from "@/types/database";
import { cn } from "@/lib/utils";

const SCALES = [0.9, 1, 1.15, 1.3];

export function ReaderSession({
  contentId,
  slug,
  title,
  signedIn,
  initiallyBookmarked,
  initialPercent,
  fontScale,
  fontFamily,
  theme,
  canReadFull,
  children,
}: {
  contentId: string;
  slug: string;
  title: string;
  signedIn: boolean;
  initiallyBookmarked: boolean;
  initialPercent: number;
  fontScale: number;
  fontFamily: ReaderFont;
  theme: ReaderTheme;
  canReadFull: boolean;
  children: React.ReactNode;
}) {
  const articleRef = React.useRef<HTMLElement>(null);
  const [scale, setScale] = React.useState(fontScale);
  const [bookmarked, setBookmarked] = React.useState(initiallyBookmarked);
  const [percent, setPercent] = React.useState(initialPercent);
  const [status, setStatus] = React.useState("");
  const storedRaw = React.useSyncExternalStore(
    (onChange) => {
      window.addEventListener("storage", onChange);
      return () => window.removeEventListener("storage", onChange);
    },
    () => window.localStorage.getItem(PROGRESS_KEY),
    () => null,
  );
  const bookmarkRaw = React.useSyncExternalStore(
    (onChange) => {
      window.addEventListener("storage", onChange);
      return () => window.removeEventListener("storage", onChange);
    },
    () => window.localStorage.getItem(BOOKMARK_KEY),
    () => null,
  );
  const storedPercent =
    parseLocalProgress(storedRaw).find((item) => item.contentId === contentId)?.progressPercent ?? 0;
  const shownPercent = Math.max(percent, storedPercent);
  const shownBookmarked =
    bookmarked || parseLocalBookmarks(bookmarkRaw).some((item) => item.contentId === contentId);

  React.useEffect(() => {
    const node = articleRef.current;
    if (!node || !canReadFull) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const viewed = Math.min(node.offsetHeight, Math.max(0, window.innerHeight - rect.top));
        const next = Math.round((viewed / node.offsetHeight) * 100);
        setPercent((current) => (Math.abs(current - next) >= 2 ? Math.max(current, next) : current));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [canReadFull]);

  React.useEffect(() => {
    if (!canReadFull || percent < 1) return;
    const handle = window.setTimeout(() => {
      const row: LocalLessonProgress = {
        contentId,
        slug,
        title,
        progressPercent: percent,
        lastPosition: { ratio: percent / 100 },
        completedAt: null,
        updatedAt: new Date().toISOString(),
      };
      const current = parseLocalProgress(window.localStorage.getItem(PROGRESS_KEY));
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(upsertLocalProgress(current, row)));
      if (signedIn) void saveReadingProgress({ contentId, percent });
    }, 800);
    return () => window.clearTimeout(handle);
  }, [canReadFull, contentId, percent, signedIn, slug, title]);

  async function onBookmark() {
    const result = await toggleBookmark({ contentId, slug });
    if (!result.ok) {
      const current = parseLocalBookmarks(window.localStorage.getItem(BOOKMARK_KEY));
      const next = toggleLocalBookmark(current, { contentId, slug, title });
      window.localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
      const kept = next.some((item) => item.contentId === contentId);
      setBookmarked(kept);
      setStatus(kept ? "Saved on this browser." : "Removed from this browser.");
      return;
    }
    setBookmarked(result.bookmarked);
    setStatus(result.bookmarked ? "Saved to your library." : "Removed from your library.");
  }

  return (
    <div
      className={cn(
        theme === "dark" && "bg-forest-deep text-paper",
        theme === "light" && "bg-surface",
      )}
    >
      <div className="sticky top-16 z-30 border-b border-copper/50 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-reading items-center justify-between gap-3 px-5 py-2 sm:px-8">
          <p className="text-sm text-ink-muted" aria-live="polite">
            {shownPercent >= 95 ? "Reading complete" : `${shownPercent}% read`}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md px-2 py-1 text-sm text-ink-soft hover:text-ink"
              onClick={() => setScale((value) => SCALES[Math.max(0, SCALES.indexOf(nearest(value)) - 1)] ?? value)}
            >
              Smaller text
            </button>
            <button
              type="button"
              className="rounded-md px-2 py-1 text-sm text-ink-soft hover:text-ink"
              onClick={() =>
                setScale((value) => SCALES[Math.min(SCALES.length - 1, SCALES.indexOf(nearest(value)) + 1)] ?? value)
              }
            >
              Larger text
            </button>
            {signedIn ? (
              <button
                type="button"
                aria-pressed={shownBookmarked}
                className="rounded-md px-2 py-1 text-sm text-forest"
                onClick={() => void onBookmark()}
              >
                {shownBookmarked ? "Saved" : "Save"}
              </button>
            ) : (
              <Link href={`/login?next=/read/${slug}`} className="text-sm text-forest">
                Sign in to save
              </Link>
            )}
          </div>
        </div>
        <div className="h-0.5 bg-copper/30" aria-hidden="true">
          <div className="h-full bg-saffron" style={{ width: `${Math.min(100, shownPercent)}%` }} />
        </div>
      </div>
      <article
        ref={articleRef}
        className={cn("mx-auto max-w-reading px-5 py-12 sm:px-8", fontFamily === "sans" && "font-sans")}
        style={{ fontSize: `${scale}rem` }}
      >
        {children}
        {status ? (
          <p className="mt-2 text-sm text-ink-muted" role="status">
            {status}
          </p>
        ) : null}
      </article>
    </div>
  );
}

function nearest(value: number) {
  return SCALES.reduce((best, item) => (Math.abs(item - value) < Math.abs(best - value) ? item : best));
}

"use client";

import * as React from "react";
import Link from "next/link";
import { BOOKMARK_KEY, parseLocalBookmarks } from "@/lib/engagement/local";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function BrowserSaves({ knownIds }: { knownIds: string[] }) {
  const raw = React.useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(BOOKMARK_KEY),
    () => null,
  );
  const known = new Set(knownIds);
  const items = parseLocalBookmarks(raw).filter((item) => !known.has(item.contentId));
  if (!items.length) return null;
  return (
    <div className="mt-10">
      <h2 className="text-2xl">On this browser</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.contentId}>
            <Link href={`/read/${item.slug}`} className="link-quiet text-forest">
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


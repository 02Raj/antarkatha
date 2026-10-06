import { parseContentBlocks, type ContentBlock } from "@/lib/content/blocks";
import { cn } from "@/lib/utils";

type StructuredContentRendererProps = {
  blocks: unknown;
  className?: string;
};

/** Renders validated JSON blocks as React text. Never interprets HTML. */
export function StructuredContentRenderer({ blocks, className }: StructuredContentRendererProps) {
  const safe = parseContentBlocks(blocks);
  if (safe.length === 0) {
    return <p className="text-ink-muted">This lesson has no readable content yet.</p>;
  }
  return (
    <div className={cn("prose-reading space-y-6", className)}>
      {safe.map((block, index) => (
        <Block key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading": {
      const Tag = block.level === "h3" ? "h3" : "h2";
      return <Tag className="text-ink">{block.text}</Tag>;
    }
    case "paragraph":
      return <p>{block.text}</p>;
    case "quote":
      return (
        <blockquote className="hairline border-l-2 pl-4 text-ink-soft italic">
          <p>{block.text}</p>
          {block.attribution ? (
            <footer className="mt-2 font-sans text-sm text-ink-muted not-italic">
              {block.attribution}
            </footer>
          ) : null}
        </blockquote>
      );
    case "verse":
      return (
        <figure className="rounded-lg bg-paper-deep/70 px-5 py-4">
          <blockquote>
            {block.lines.map((line) => (
              <p key={line} className="text-center italic">
                {line}
              </p>
            ))}
          </blockquote>
          {block.note ? (
            <figcaption className="mt-3 font-sans text-sm text-ink-muted">{block.note}</figcaption>
          ) : null}
        </figure>
      );
    case "translation":
      return <p className="text-ink-soft">{block.text}</p>;
    case "callout":
      return (
        <aside
          className={cn(
            "rounded-lg border px-4 py-3 font-sans text-sm leading-relaxed",
            block.tone === "warning"
              ? "border-saffron/30 bg-saffron-wash/70 text-saffron-ink"
              : "border-forest/20 bg-forest-wash/50 text-forest-deep",
          )}
        >
          {block.text}
        </aside>
      );
    case "divider":
      return <hr className="hairline border-t" />;
    case "reflection":
      return (
        <section className="rounded-lg border border-copper/50 bg-surface px-5 py-4">
          <p className="eyebrow">Reflection</p>
          <p className="mt-2">{block.prompt}</p>
        </section>
      );
    case "practice":
      return (
        <section className="rounded-lg bg-forest px-5 py-4 text-surface">
          <p className="font-sans text-xs font-semibold tracking-[0.14em] text-copper-soft uppercase">
            {block.title}
          </p>
          <p className="mt-2 text-surface">{block.text}</p>
        </section>
      );
    case "source-note":
      return (
        <p className="font-sans text-sm text-ink-muted">
          <span className="font-medium text-ink-soft">Source. </span>
          {block.text}
        </p>
      );
  }
}

import { cn } from "@/lib/utils";

type MarkProps = { className?: string; title?: string };

/**
 * Open page with a single line rising from the spine and curling inward —
 * a river that becomes a lamp flame and a self-inquiry spiral.
 */
export function LogoMark({ className, title }: MarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("size-8", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path
        d="M24 39c-5-3.6-11.5-4.6-18-3.6V17.2c6.5-1 13 0 18 3.6 5-3.6 11.5-4.6 18-3.6v18.2c-6.5-1-13 0-18 3.6Z"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinejoin="round"
      />
      <path d="M24 20.8V39" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
      <path
        d="M24 20.8c0-5.6 6.6-6.6 6.6-11.2 0-3.6-4.3-4.6-6-2-1.3 2 .6 3.9 2.4 2.7"
        stroke="var(--color-saffron)"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type LogoProps = { className?: string; brandName?: string; showWordmark?: boolean };

export function Logo({ className, brandName = "AntarKatha", showWordmark = true }: LogoProps) {
  const split = splitBrand(brandName);
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-forest-deep", className)}>
      <LogoMark className="size-8 shrink-0" />
      {showWordmark ? (
        <span className="font-serif text-[1.375rem] leading-none tracking-[-0.01em] text-ink">
          {split.first}
          {split.second ? <span className="text-saffron-ink italic">{split.second}</span> : null}
        </span>
      ) : (
        <span className="sr-only">{brandName}</span>
      )}
    </span>
  );
}

/** "AntarKatha" -> ["Antar", "Katha"]; any other name renders unsplit. */
export function splitBrand(name: string): { first: string; second?: string } {
  const match = /^([A-Z][a-z]+)([A-Z][a-z]+)$/.exec(name.trim());
  return match ? { first: match[1], second: match[2] } : { first: name };
}

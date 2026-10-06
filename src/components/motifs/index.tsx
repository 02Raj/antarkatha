import { cn } from "@/lib/utils";

type MotifProps = { className?: string };

const base = { fill: "none", "aria-hidden": true as const, focusable: "false" as const };

/** Concentric, slightly off-centre rings — the motif for self-inquiry. */
export function InwardCircles({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 200 200" className={cn("text-copper", className)} {...base}>
      {[92, 74, 57, 41, 26, 13].map((r, i) => (
        <circle
          key={r}
          cx={100 + i * 2.2}
          cy={100 - i * 1.4}
          r={r}
          stroke="currentColor"
          strokeWidth={i === 5 ? 1.6 : 1}
          opacity={0.35 + i * 0.1}
        />
      ))}
      <circle cx="111" cy="93" r="3" fill="var(--color-saffron)" />
    </svg>
  );
}

/** A slow river line that runs across a section. */
export function RiverLine({ className }: MotifProps) {
  return (
    <svg
      viewBox="0 0 600 60"
      preserveAspectRatio="none"
      className={cn("text-copper", className)}
      {...base}
    >
      <path
        d="M0 38c60-22 110-22 160-6s96 18 150-4 104-26 160-6 90 16 130 4"
        stroke="currentColor"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 46c70-16 120-14 170 0s100 12 150-6 100-18 150-2 92 12 130 2"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.45"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** A single leaf drawn as one stroke with a central vein. */
export function LeafLine({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 64 64" className={cn("text-forest", className)} {...base}>
      <path
        d="M10 54C12 30 28 12 54 10c-2 26-20 42-44 44Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 54C24 40 34 30 46 18"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** A small diya outline with a still flame. */
export function LampMark({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 64 64" className={cn("text-copper", className)} {...base}>
      <path
        d="M8 38c6 10 16 14 24 14s18-4 24-14H8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M32 34c-5-4-5-10 0-20 5 10 5 16 0 20Z"
        stroke="var(--color-saffron)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Ornamental section divider: hairline, small lozenge, hairline. */
export function Ornament({ className }: MotifProps) {
  return (
    <div className={cn("flex items-center gap-3 text-copper", className)} aria-hidden="true">
      <span className="h-px flex-1 bg-current opacity-60" />
      <svg viewBox="0 0 24 12" className="h-3 w-6" {...base}>
        <path d="M2 6h6M16 6h6" stroke="currentColor" strokeWidth="1" />
        <path d="M12 1.5 16 6l-4 4.5L8 6l4-4.5Z" stroke="currentColor" strokeWidth="1" />
      </svg>
      <span className="h-px flex-1 bg-current opacity-60" />
    </div>
  );
}

export type MotifKey = "circles" | "river" | "leaf" | "lamp";

export function Motif({ name, className }: { name: MotifKey } & MotifProps) {
  switch (name) {
    case "circles":
      return <InwardCircles className={className} />;
    case "river":
      return <RiverLine className={className} />;
    case "leaf":
      return <LeafLine className={className} />;
    case "lamp":
      return <LampMark className={className} />;
  }
}

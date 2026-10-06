import Link from "next/link";

export function AnnouncementStrip({
  message,
  href = "/daily",
}: {
  message: string | null;
  href?: string;
}) {
  if (!message) return null;
  return (
    <div className="hairline border-b bg-forest-deep text-paper">
      <p className="mx-auto max-w-content px-5 py-2 text-center text-[0.8125rem] tracking-[0.01em] sm:px-8">
        <Link href={href} className="link-quiet decoration-paper/40 hover:decoration-paper">
          {message}
        </Link>
      </p>
    </div>
  );
}

import Link from "next/link";
import { footerNav, type SiteSettings } from "@/config/site";
import { Logo } from "@/components/brand/logo";
import { RiverLine } from "@/components/motifs";

type SiteFooterProps = Pick<SiteSettings, "brandName" | "tagline" | "contactEmail" | "social">;

export function SiteFooter({ brandName, tagline, contactEmail, social }: SiteFooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="hairline mt-auto border-t bg-surface/70">
      <RiverLine className="h-10 w-full opacity-70" />
      <div className="mx-auto grid max-w-content gap-12 px-5 pt-6 pb-12 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo brandName={brandName} />
          <p className="mt-4 font-serif text-lg leading-snug text-ink-soft">{tagline}</p>
          <p className="mt-4 text-sm text-ink-muted">
            Questions or corrections?{" "}
            <a href={`mailto:${contactEmail}`} className="link-quiet text-forest">
              {contactEmail}
            </a>
          </p>
        </div>
        {footerNav.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h2 className="font-sans text-xs font-semibold tracking-[0.14em] text-ink-muted uppercase">
              {group.heading}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-quiet text-[0.9375rem] text-ink-soft hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="hairline border-t">
        <div className="mx-auto flex max-w-content flex-col gap-3 px-5 py-5 text-[0.8125rem] text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {year} {brandName}. Lessons are adaptations; each one names its source.
          </p>
          {social.length > 0 ? (
            <ul className="flex gap-4">
              {social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="link-quiet" rel="noopener noreferrer" target="_blank">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

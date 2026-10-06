import Link from "next/link";
import type { NavItem } from "@/config/site";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavLink } from "./nav-link";
import { MobileNav } from "./mobile-nav";

export type HeaderViewer = { displayName: string | null; isStaff: boolean } | null;
/** `undefined` means the auth slot is still resolving. */
export type HeaderViewerState = HeaderViewer | undefined;

type SiteHeaderProps = {
  brandName: string;
  nav: NavItem[];
  viewer: HeaderViewerState;
};

export function SiteHeader({ brandName, nav, viewer }: SiteHeaderProps) {
  return (
    <header className="hairline sticky top-0 z-40 border-b bg-paper/92 backdrop-blur-[6px] supports-[backdrop-filter]:bg-paper/80">
      <div className="mx-auto flex h-16 max-w-content items-center gap-6 px-5 sm:px-8">
        <Link href="/" className="-ml-1 rounded-md p-1" aria-label={`${brandName} home`}>
          <Logo brandName={brandName} />
        </Link>

        <nav aria-label="Primary" className="ml-6 hidden md:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          {viewer === undefined ? (
            <span
              className="inline-block h-9 w-28 animate-pulse rounded-md bg-paper-deep motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : viewer ? (
            <>
              {viewer.isStaff ? <NavLink href="/admin">Admin</NavLink> : null}
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Your practice
              </Link>
            </>
          ) : (
            <>
              <NavLink href="/login">Sign in</NavLink>
              <Link href="/daily" className={cn(buttonVariants({ size: "sm" }), "ml-2")}>
                Begin today’s reading
              </Link>
            </>
          )}
        </div>

        <div className="ml-auto md:hidden">
          <MobileNav brandName={brandName} nav={nav} viewer={viewer} />
        </div>
      </div>
    </header>
  );
}

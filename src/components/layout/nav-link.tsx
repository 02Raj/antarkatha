"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname() ?? "/";
  const active = isActivePath(pathname, href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative py-2 text-[0.9375rem] text-ink-soft transition-colors duration-200 hover:text-ink",
        "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-saffron after:transition-transform after:duration-200",
        "hover:after:scale-x-100 aria-[current=page]:text-ink aria-[current=page]:after:scale-x-100",
        className,
      )}
    >
      {children}
    </Link>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import type { NavItem } from "@/config/site";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { RiverLine } from "@/components/motifs";
import { cn } from "@/lib/utils";
import { isActivePath } from "./nav-link";
import type { HeaderViewer } from "./site-header";

type MobileNavProps = { brandName: string; nav: NavItem[]; viewer: HeaderViewer | undefined };

export function MobileNav({ brandName, nav, viewer }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname() ?? "/";
  const [lastPath, setLastPath] = React.useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const extra: NavItem[] =
    viewer === undefined
      ? []
      : viewer
        ? [
            { label: "Your practice", href: "/dashboard" },
            ...(viewer.isStaff ? [{ label: "Admin", href: "/admin" }] : []),
          ]
        : [{ label: "Sign in", href: "/login" }];
  const links: NavItem[] = [...nav, ...extra];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "quiet", size: "icon" }), "-mr-2")}
        aria-label="Open menu"
      >
        <Menu className="!size-5" aria-hidden="true" />
      </DialogTrigger>
      <DialogContent side="right" title={brandName} className="gap-0">
        <nav aria-label="Mobile" className="mt-8 flex-1">
          <ul className="flex flex-col">
            {links.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href} className="hairline border-b">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="flex items-center justify-between py-4 font-serif text-xl text-ink aria-[current=page]:text-saffron-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <RiverLine className="my-6 h-8 w-full" />
        {viewer === null ? (
          <Link href="/daily" className={buttonVariants({ size: "lg" })}>
            Begin today’s reading
          </Link>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

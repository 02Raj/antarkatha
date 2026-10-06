import type { NavItem } from "@/config/site";
import { getViewer, toHeaderViewer } from "@/lib/auth/viewer";
import { SiteHeader } from "./site-header";

export async function SiteHeaderConnected({
  brandName,
  nav,
}: {
  brandName: string;
  nav: NavItem[];
}) {
  const viewer = toHeaderViewer(await getViewer());
  return <SiteHeader brandName={brandName} nav={nav} viewer={viewer} />;
}

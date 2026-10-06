import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminDesks, type AdminDeskSlug } from "@/config/admin-desks";
import { AdminDeskPlaceholder } from "@/components/admin/desk-placeholder";

type Props = { params: Promise<{ section: string }> };

function deskOf(section: string) {
  if (!(section in adminDesks)) notFound();
  return adminDesks[section as AdminDeskSlug];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const desk = deskOf(section);
  return { title: desk.title, robots: { index: false, follow: false } };
}

export default async function AdminDeskPage({ params }: Props) {
  const { section } = await params;
  const desk = deskOf(section);
  return <AdminDeskPlaceholder title={desk.title} note={desk.note} />;
}

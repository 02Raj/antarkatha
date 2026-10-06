import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui/layout";
import { buttonVariants } from "@/components/ui/button";
import { getViewer } from "@/lib/auth/viewer";
import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Your practice" };

export default async function DashboardPage() {
  const viewer = await getViewer();

  return (
    <Container className="py-16">
      <SectionHeading
        as="h1"
        eyebrow="Dashboard"
        title={viewer?.displayName ? `${viewer.displayName}’s practice` : "Your practice"}
        description="Continue reading, today’s lesson, streak, and saved items will live here once the library screens are wired in Phase 4."
      />
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/daily" className={buttonVariants()}>
          Today’s lesson
        </Link>
        <Link href="/explore" className={buttonVariants({ variant: "outline" })}>
          Explore the library
        </Link>
        <Link href="/settings" className={buttonVariants({ variant: "quiet" })}>
          Settings
        </Link>
        <form action={signOut}>
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>
    </Container>
  );
}

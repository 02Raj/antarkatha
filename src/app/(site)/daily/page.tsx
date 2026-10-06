import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { getDailyLesson } from "@/lib/catalog/queries";
import { PublicLesson } from "@/components/reader/public-lesson";
import { Notice } from "@/components/ui/feedback";
import { Container } from "@/components/ui/layout";

export const metadata: Metadata = pageMetadata({
  title: "Today’s lesson",
  description: "A five-minute open reading. The daily lesson is never behind the paywall.",
  path: "/daily",
});

export default async function DailyPage() {
  const { data, source } = await getDailyLesson();
  return (
    <>
      <Container className="pt-10">
        <Notice title="Today’s open lesson">
          Featured for {data.featureDate} ({data.timezone}). Guests and members can read this one in
          full.
          {source === "demo" ? " Showing the demo catalogue until the live desk is seeded." : ""}
        </Notice>
      </Container>
      <PublicLesson lesson={data.lesson} canReadFull />
    </>
  );
}

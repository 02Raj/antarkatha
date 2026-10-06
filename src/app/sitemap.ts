import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";
import { listCollections, listLessons, listTopics } from "@/lib/catalog/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: collections }, { data: topics }, { data: lessons }] = await Promise.all([
    listCollections(),
    listTopics(),
    listLessons(),
  ]);

  const staticPaths = [
    "",
    "/explore",
    "/daily",
    "/pricing",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/refund-policy",
  ];

  return [
    ...staticPaths.map((path) => ({
      url: absoluteUrl(path || "/"),
      changeFrequency: path === "/daily" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : 0.7,
    })),
    ...collections.map((item) => ({
      url: absoluteUrl(`/collections/${item.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...topics.map((item) => ({
      url: absoluteUrl(`/topics/${item.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...lessons.map((item) => ({
      url: absoluteUrl(`/read/${item.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

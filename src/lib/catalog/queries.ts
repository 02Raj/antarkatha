import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { parseContentBlocks } from "@/lib/content/blocks";
import { canReadFullLesson } from "@/lib/domain/access";
import { getViewer } from "@/lib/auth/viewer";
import {
  DEMO_COLLECTIONS,
  DEMO_DAILY_SLUG,
  DEMO_LESSONS,
  DEMO_PLANS,
  DEMO_TOPICS,
} from "@/content/demo-catalog";
import { defaultSiteSettings, type SiteSettings } from "@/config/site";
import type { Database, Json } from "@/types/database";
import type {
  CatalogCollection,
  CatalogDaily,
  CatalogLesson,
  CatalogPlan,
  CatalogTopic,
} from "./types";
import { filterLessons, paginateLessons, sortLessons, type ExploreFilters } from "./filter";

export type CatalogSource = "supabase" | "demo";

type CatalogClient = NonNullable<Awaited<ReturnType<typeof createServerSupabase>>>;

async function withClient<T>(
  load: (client: CatalogClient) => Promise<T | null>,
): Promise<T | null> {
  if (!isSupabaseConfigured()) return null;
  const client = await createServerSupabase();
  if (!client) return null;
  try {
    return await load(client);
  } catch {
    return null;
  }
}

function motifOf(cover: Json | null | undefined) {
  if (cover && typeof cover === "object" && !Array.isArray(cover) && "motif" in cover) {
    const motif = cover.motif;
    return typeof motif === "string" ? motif : "inward-circles";
  }
  return "inward-circles";
}

function stringFeatures(value: Json): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function mapCollection(row: Database["public"]["Tables"]["collections"]["Row"]): CatalogCollection {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortTitle: row.short_title,
    description: row.description,
    introduction: row.introduction,
    sortOrder: row.sort_order,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    coverMotif: motifOf(row.cover_config),
  };
}

function mapTopic(row: Database["public"]["Tables"]["topics"]["Row"]): CatalogTopic {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    iconKey: row.icon_key,
    sortOrder: row.sort_order,
  };
}

type CatalogRow = Database["public"]["Views"]["content_catalog"]["Row"];

function mapLesson(
  row: CatalogRow | Database["public"]["Tables"]["content_items"]["Row"],
  collection: CatalogCollection,
  topicSlugs: string[],
  body: CatalogLesson["body"],
): CatalogLesson {
  const preview = "preview_blocks" in row ? parseContentBlocks(row.preview_blocks) : [];
  const hasAudio =
    "has_audio" in row ? Boolean(row.has_audio) : Boolean("audio_path" in row && row.audio_path);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    summary: row.summary,
    collectionId: row.collection_id,
    collectionSlug: collection.slug,
    collectionTitle: collection.title,
    language: row.language,
    type: row.type,
    difficulty: row.difficulty,
    accessTier: row.access_tier,
    readingMinutes: row.reading_minutes,
    previewBlocks: preview.length
      ? preview
      : parseContentBlocks([{ type: "paragraph", text: row.summary }]),
    body,
    hasAudio,
    sourceTitle: row.source_title,
    sourceLocator: row.source_locator,
    adaptationNote: row.adaptation_note,
    publishedAt: row.published_at,
    sortOrder: row.sort_order,
    topicSlugs,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  };
}

export async function listCollections(): Promise<{
  data: CatalogCollection[];
  source: CatalogSource;
}> {
  const remote = await withClient(async (supabase) => {
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("status", "published")
      .order("sort_order");
    if (error || !data?.length) return null;
    return data.map(mapCollection);
  });
  return remote ? { data: remote, source: "supabase" } : { data: DEMO_COLLECTIONS, source: "demo" };
}

export async function listTopics(): Promise<{ data: CatalogTopic[]; source: CatalogSource }> {
  const remote = await withClient(async (supabase) => {
    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .eq("archived", false)
      .order("sort_order");
    if (error || !data?.length) return null;
    return data.map(mapTopic);
  });
  return remote ? { data: remote, source: "supabase" } : { data: DEMO_TOPICS, source: "demo" };
}

export async function listPlans(): Promise<{ data: CatalogPlan[]; source: CatalogSource }> {
  const remote = await withClient(async (supabase) => {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    if (error || !data?.length) return null;
    return data.map((row) => ({
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      billingInterval: row.billing_interval,
      pricePaise: row.price_paise,
      currency: row.currency,
      features: stringFeatures(row.features),
      sortOrder: row.sort_order,
    }));
  });
  return remote ? { data: remote, source: "supabase" } : { data: DEMO_PLANS, source: "demo" };
}

async function loadTopicMap(supabase: CatalogClient) {
  const [{ data: topics }, { data: joins }] = await Promise.all([
    supabase.from("topics").select("id, slug"),
    supabase.from("content_topics").select("content_id, topic_id"),
  ]);
  const slugById = new Map((topics ?? []).map((topic) => [topic.id, topic.slug]));
  const byContent = new Map<string, string[]>();
  for (const join of joins ?? []) {
    const slug = slugById.get(join.topic_id);
    if (!slug) continue;
    const list = byContent.get(join.content_id) ?? [];
    list.push(slug);
    byContent.set(join.content_id, list);
  }
  return byContent;
}

async function loadRemoteLessons(): Promise<CatalogLesson[] | null> {
  return withClient(async (supabase) => {
    const [{ data: catalog, error }, collectionsResult, topicMap] = await Promise.all([
      supabase.from("content_catalog").select("*"),
      listCollections(),
      loadTopicMap(supabase),
    ]);
    if (error || !catalog?.length) return null;
    const collections = new Map(collectionsResult.data.map((c) => [c.id, c]));
    return catalog
      .map((row) => {
        const collection = collections.get(row.collection_id);
        if (!collection) return null;
        return mapLesson(row, collection, topicMap.get(row.id) ?? [], []);
      })
      .filter((row): row is CatalogLesson => row !== null);
  });
}

export async function listLessons(): Promise<{ data: CatalogLesson[]; source: CatalogSource }> {
  const remote = await loadRemoteLessons();
  return remote ? { data: remote, source: "supabase" } : { data: DEMO_LESSONS, source: "demo" };
}

export async function searchLessons(filters: ExploreFilters) {
  const [{ data: lessons, source }, { data: collections }] = await Promise.all([
    listLessons(),
    listCollections(),
  ]);
  const order = new Map(collections.map((c) => [c.slug, c.sortOrder]));
  const filtered = sortLessons(filterLessons(lessons, filters), filters.sort, order);
  return { ...paginateLessons(filtered, filters.page), source };
}

export async function getCollectionBySlug(slug: string) {
  const { data, source } = await listCollections();
  const collection = data.find((item) => item.slug === slug) ?? null;
  const lessons = collection
    ? (await listLessons()).data
        .filter((lesson) => lesson.collectionSlug === slug)
        .sort((a, b) => a.sortOrder - b.sortOrder)
    : [];
  return { collection, lessons, source };
}

export async function getTopicBySlug(slug: string) {
  const { data, source } = await listTopics();
  const topic = data.find((item) => item.slug === slug) ?? null;
  const lessons = topic
    ? (await listLessons()).data.filter((lesson) => lesson.topicSlugs.includes(slug))
    : [];
  return { topic, lessons, source };
}

export async function getDailyLesson(): Promise<{ data: CatalogDaily; source: CatalogSource }> {
  const remote = await withClient(async (supabase) => {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    const { data, error } = await supabase
      .from("daily_features")
      .select("feature_date, timezone, content_id")
      .eq("active", true)
      .eq("feature_date", today)
      .maybeSingle();
    if (error || !data) return null;
    const lesson = await getLessonBySlugId(data.content_id);
    if (!lesson) return null;
    return { timezone: data.timezone, featureDate: data.feature_date, lesson };
  });
  const fallbackLesson =
    DEMO_LESSONS.find((item) => item.slug === DEMO_DAILY_SLUG) ?? DEMO_LESSONS[0]!;
  return remote
    ? { data: remote, source: "supabase" }
    : {
        data: {
          timezone: "Asia/Kolkata",
          featureDate: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }),
          lesson: fallbackLesson,
        },
        source: "demo",
      };
}

async function getLessonBySlugId(id: string) {
  const { data } = await listLessons();
  return data.find((item) => item.id === id) ?? null;
}

export async function getLessonBySlug(slug: string) {
  const { data: lessons, source } = await listLessons();
  const listed = lessons.find((item) => item.slug === slug);
  if (!listed) return { lesson: null, neighbours: [] as CatalogLesson[], source };

  const daily = await getDailyLesson();
  const viewer = await getViewer();
  const entitled = await userHasLibrary(viewer?.id ?? null);
  const full = canReadFullLesson({
    role: viewer?.role ?? null,
    isAuthenticated: Boolean(viewer),
    hasLibraryEntitlement: entitled,
    isDailyLesson: daily.data.lesson.slug === listed.slug,
    accessTier: listed.accessTier,
    status: "published",
  });

  const hydrated = await hydrateBody(listed, full);
  const neighbours = lessons
    .filter((item) => item.collectionSlug === listed.collectionSlug)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return { lesson: hydrated, neighbours, source, canReadFull: full };
}

async function hydrateBody(lesson: CatalogLesson, canReadFull: boolean): Promise<CatalogLesson> {
  if (!canReadFull) {
    return { ...lesson, body: lesson.previewBlocks };
  }
  if (lesson.body.length) return lesson;
  const remoteBody = await withClient(async (supabase) => {
    const { data, error } = await supabase
      .from("content_items")
      .select("body")
      .eq("id", lesson.id)
      .maybeSingle();
    if (error || !data) return null;
    return parseContentBlocks(data.body);
  });
  if (remoteBody?.length) return { ...lesson, body: remoteBody };
  const demo = DEMO_LESSONS.find((item) => item.slug === lesson.slug);
  return { ...lesson, body: demo?.body ?? lesson.previewBlocks };
}

async function userHasLibrary(userId: string | null) {
  if (!userId) return false;
  const result = await withClient(async (supabase) => {
    const { data, error } = await supabase
      .from("entitlements")
      .select("id")
      .eq("user_id", userId)
      .eq("active", true)
      .limit(1);
    if (error) return false;
    return Boolean(data?.length);
  });
  return result ?? false;
}

export async function getSiteSettingsLive(): Promise<SiteSettings> {
  const remote = await withClient(async (supabase) => {
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error || !data?.length) return null;
    const map = Object.fromEntries(data.map((row) => [row.key, row.value]));
    const brand = (map.brand ?? {}) as Record<string, unknown>;
    const seo = (map.seo ?? {}) as Record<string, unknown>;
    const navigation = (map.navigation ?? {}) as Record<string, unknown>;
    return {
      ...defaultSiteSettings,
      brandName:
        typeof brand.brandName === "string" ? brand.brandName : defaultSiteSettings.brandName,
      tagline: typeof brand.tagline === "string" ? brand.tagline : defaultSiteSettings.tagline,
      contactEmail:
        typeof brand.contactEmail === "string"
          ? brand.contactEmail
          : defaultSiteSettings.contactEmail,
      announcement:
        typeof brand.announcement === "string" || brand.announcement === null
          ? (brand.announcement as string | null)
          : defaultSiteSettings.announcement,
      seo: {
        titleTemplate:
          typeof seo.titleTemplate === "string"
            ? seo.titleTemplate
            : defaultSiteSettings.seo.titleTemplate,
        defaultTitle:
          typeof seo.defaultTitle === "string"
            ? seo.defaultTitle
            : defaultSiteSettings.seo.defaultTitle,
        defaultDescription:
          typeof seo.defaultDescription === "string"
            ? seo.defaultDescription
            : defaultSiteSettings.seo.defaultDescription,
      },
      primaryNav: Array.isArray(navigation.primaryNav)
        ? defaultSiteSettings.primaryNav
        : defaultSiteSettings.primaryNav,
      social: Array.isArray(navigation.social)
        ? defaultSiteSettings.social
        : defaultSiteSettings.social,
    } satisfies SiteSettings;
  });
  return remote ?? defaultSiteSettings;
}

export function collectionOrder(collections: CatalogCollection[]) {
  return new Map(collections.map((item) => [item.slug, item.sortOrder]));
}

import type {
  AccessTier,
  BillingInterval,
  ContentType,
  DifficultyLevel,
  LanguageCode,
} from "@/types/database";
import type { ContentBlock } from "@/lib/content/blocks";

export type CatalogCollection = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  introduction: string;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  coverMotif: string;
};

export type CatalogTopic = {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconKey: string;
  sortOrder: number;
};

export type CatalogLesson = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string;
  collectionId: string;
  collectionSlug: string;
  collectionTitle: string;
  language: LanguageCode;
  type: ContentType;
  difficulty: DifficultyLevel;
  accessTier: AccessTier;
  readingMinutes: number;
  previewBlocks: ContentBlock[];
  body: ContentBlock[];
  hasAudio: boolean;
  sourceTitle: string | null;
  sourceLocator: string | null;
  adaptationNote: string | null;
  publishedAt: string | null;
  sortOrder: number;
  topicSlugs: string[];
  seoTitle: string | null;
  seoDescription: string | null;
};

export type CatalogPlan = {
  id: string;
  code: string;
  name: string;
  description: string;
  billingInterval: BillingInterval | null;
  pricePaise: number;
  currency: string;
  features: string[];
  sortOrder: number;
};

export type CatalogDaily = {
  timezone: string;
  featureDate: string;
  lesson: CatalogLesson;
};

export const EXPLORE_PAGE_SIZE = 6;

export type DurationBucket = "short" | "medium" | "long";
export type ExploreSort = "recommended" | "newest" | "shortest" | "collection";

export type ExploreFilters = {
  q: string;
  collection: string;
  topic: string;
  type: "" | ContentType;
  duration: "" | DurationBucket;
  difficulty: "" | DifficultyLevel;
  access: "" | AccessTier;
  sort: ExploreSort;
  page: number;
};

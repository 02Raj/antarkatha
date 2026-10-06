import type { ReviewStatus } from "@/types/database";

export type PublishableFields = {
  sourceTitle?: string | null;
  sourceLocator?: string | null;
  adaptationNote?: string | null;
  reviewStatus: ReviewStatus;
};

export function publishingBlockers(fields: PublishableFields): string[] {
  const blockers: string[] = [];
  if (!fields.sourceTitle?.trim()) blockers.push("Source title is required");
  if (!fields.sourceLocator?.trim()) blockers.push("Source locator is required");
  if (!fields.adaptationNote?.trim()) blockers.push("Adaptation note is required");
  if (fields.reviewStatus !== "approved") {
    blockers.push("Editorial review must be approved");
  }
  return blockers;
}

export function canPublish(fields: PublishableFields) {
  return publishingBlockers(fields).length === 0;
}

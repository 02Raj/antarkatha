import type { AccessTier, EditorialStatus, UserRole } from "@/types/database";

export type AccessInput = {
  role: UserRole | null;
  isAuthenticated: boolean;
  hasLibraryEntitlement: boolean;
  isDailyLesson: boolean;
  accessTier: AccessTier;
  status: EditorialStatus;
};

export function isStaffRole(role: UserRole | null | undefined): boolean {
  return role === "editor" || role === "admin";
}

export function isAdminRole(role: UserRole | null | undefined): boolean {
  return role === "admin";
}

export function isPublished(status: EditorialStatus) {
  return status === "published";
}

/** Catalog cards may show published metadata regardless of paywall. */
export function canSeeInCatalog(input: Pick<AccessInput, "status" | "role">) {
  return isPublished(input.status) || isStaffRole(input.role);
}

/**
 * Full body and audio. Daily lesson is never blocked.
 * Staff may read drafts. Premium requires a verified entitlement.
 */
export function canReadFullLesson(input: AccessInput) {
  if (isStaffRole(input.role)) return true;
  if (!isPublished(input.status)) return false;
  if (input.accessTier === "free") return true;
  if (input.isDailyLesson) return true;
  return input.isAuthenticated && input.hasLibraryEntitlement;
}

export function shouldShowPaywall(input: AccessInput) {
  return isPublished(input.status) && !canReadFullLesson(input);
}

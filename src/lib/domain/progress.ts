export type ReadingProgress = {
  progressPercent: number;
  lastPosition: Record<string, unknown>;
  completedAt: string | null;
  updatedAt: string;
};

export const COMPLETION_THRESHOLD = 95;

export function clampProgress(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value * 100) / 100));
}

export function isLessonComplete(progressPercent: number, threshold = COMPLETION_THRESHOLD) {
  return clampProgress(progressPercent) >= threshold;
}

export function withCompletion(
  progress: ReadingProgress,
  nowIso = new Date().toISOString(),
): ReadingProgress {
  const progressPercent = clampProgress(progress.progressPercent);
  const complete = isLessonComplete(progressPercent);
  return {
    ...progress,
    progressPercent,
    completedAt: complete ? (progress.completedAt ?? nowIso) : null,
    updatedAt: nowIso,
  };
}

/** Guest localStorage progress merged after signup: keep the farther, newer record. */
export function mergeProgress(a: ReadingProgress, b: ReadingProgress): ReadingProgress {
  const newer = a.updatedAt >= b.updatedAt ? a : b;
  const older = newer === a ? b : a;
  const progressPercent = Math.max(
    clampProgress(a.progressPercent),
    clampProgress(b.progressPercent),
  );
  const completedAt = a.completedAt ?? b.completedAt;
  return withCompletion(
    {
      progressPercent,
      lastPosition:
        Object.keys(newer.lastPosition).length > 0 ? newer.lastPosition : older.lastPosition,
      completedAt,
      updatedAt: newer.updatedAt,
    },
    newer.updatedAt,
  );
}

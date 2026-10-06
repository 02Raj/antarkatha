export type StreakState = {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
};

const DAY_MS = 86_400_000;

function utcDay(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return Date.UTC(y, (m ?? 1) - 1, d ?? 1);
}

function dayDiff(later: string, earlier: string) {
  return Math.round((utcDay(later) - utcDay(earlier)) / DAY_MS);
}

/**
 * Apply one activity day (YYYY-MM-DD in the user's practice timezone).
 * Same day: no change. Yesterday: increment. Older/gap: reset to 1.
 */
export function applyStreak(state: StreakState, activityDate: string): StreakState {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(activityDate)) {
    throw new Error("activityDate must be YYYY-MM-DD");
  }

  if (state.lastActivityDate === activityDate) {
    return state;
  }

  let current = 1;
  if (state.lastActivityDate) {
    const delta = dayDiff(activityDate, state.lastActivityDate);
    if (delta === 1) current = state.currentStreak + 1;
    else if (delta < 0) return state;
  }

  return {
    currentStreak: current,
    longestStreak: Math.max(state.longestStreak, current),
    lastActivityDate: activityDate,
  };
}

// Fortnight math for issue numbering. Two periods per month: the 1st to the 15th
// and the 16th to the end of the month. Issue 01 is the second half of June 2026
// (16 to 30 June 2026), matching the first printed Asia Source issue.
//
// This module is intentionally dependency-free so the Supabase Edge Function can
// use the same logic (a copy lives in supabase/functions/_shared/fortnight.ts).

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export type Period = {
  issueNumber: number;
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
};

// Epoch: issue 1 = the second half of June 2026. June is month index 5.
const EPOCH_YEAR = 2026;
const EPOCH_MONTH = 5; // June (0-based)

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function iso(year: number, month0: number, day: number): string {
  return `${year}-${pad(month0 + 1)}-${pad(day)}`;
}

function lastDayOfMonth(year: number, month0: number): number {
  return new Date(year, month0 + 1, 0).getDate();
}

// The 1-based fortnight index for a given date. Index 1 = 16 to 30 June 2026.
// First half of a month is the lower index, second half the higher one.
export function fortnightIndex(d: Date): number {
  const monthsFromEpoch = (d.getFullYear() - EPOCH_YEAR) * 12 + (d.getMonth() - EPOCH_MONTH);
  const secondHalf = d.getDate() >= 16 ? 1 : 0;
  // Epoch (Jun 2026 second half) must map to 1, so offset accordingly.
  return monthsFromEpoch * 2 + secondHalf;
}

// Builds a Period from a fortnight index (>= 1). Inverse of fortnightIndex:
// half = index % 2 (1 == second half of the month), monthsFromEpoch = index / 2.
export function periodFromIndex(index: number): Period {
  const secondHalf = index % 2 === 1;
  const monthsFromEpoch = Math.floor(index / 2);
  const totalMonth = EPOCH_MONTH + monthsFromEpoch;
  const year = EPOCH_YEAR + Math.floor(totalMonth / 12);
  const month0 = ((totalMonth % 12) + 12) % 12;
  if (!secondHalf) {
    return { issueNumber: index, start: iso(year, month0, 1), end: iso(year, month0, 15) };
  }
  return {
    issueNumber: index,
    start: iso(year, month0, 16),
    end: iso(year, month0, lastDayOfMonth(year, month0)),
  };
}

// The period currently in progress for a given moment (defaults to now).
export function currentPeriod(now: Date = new Date()): Period {
  return periodFromIndex(fortnightIndex(now));
}

// The period that just ended before a given moment. This is what a fortnightly
// draft should cover when it runs at the start of a new period.
export function previousPeriod(now: Date = new Date()): Period {
  const idx = fortnightIndex(now);
  return periodFromIndex(Math.max(1, idx - 1));
}

// Human label for a period, e.g. "16 to 30 June 2026" or spanning styles.
export function periodLabel(start: string, end: string): string {
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  const sMonth = MONTHS[sm - 1];
  const eMonth = MONTHS[em - 1];
  if (sy === ey && sm === em) {
    return `${sd} to ${ed} ${eMonth} ${ey}`;
  }
  if (sy === ey) {
    return `${sd} ${sMonth} to ${ed} ${eMonth} ${ey}`;
  }
  return `${sd} ${sMonth} ${sy} to ${ed} ${eMonth} ${ey}`;
}

// "Issue 01", "Issue 12", etc.
export function formatIssueNumber(n: number): string {
  return `Issue ${String(n).padStart(2, "0")}`;
}

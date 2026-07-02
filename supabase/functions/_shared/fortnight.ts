// Copy of the fortnight math used by the app (src/lib/publications/fortnight.ts),
// kept dependency-free so the Edge Functions (Deno) can compute the current and
// previous fortnight without importing app code. Keep the two in sync.

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export type Period = { issueNumber: number; start: string; end: string };

const EPOCH_YEAR = 2026;
const EPOCH_MONTH = 5; // June (0-based)

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m0: number, d: number) => `${y}-${pad(m0 + 1)}-${pad(d)}`;
const lastDay = (y: number, m0: number) => new Date(y, m0 + 1, 0).getDate();

export function fortnightIndex(d: Date): number {
  const months = (d.getFullYear() - EPOCH_YEAR) * 12 + (d.getMonth() - EPOCH_MONTH);
  return months * 2 + (d.getDate() >= 16 ? 1 : 0);
}

export function periodFromIndex(index: number): Period {
  const secondHalf = index % 2 === 1;
  const monthsFromEpoch = Math.floor(index / 2);
  const total = EPOCH_MONTH + monthsFromEpoch;
  const year = EPOCH_YEAR + Math.floor(total / 12);
  const month0 = ((total % 12) + 12) % 12;
  if (!secondHalf) {
    return { issueNumber: index, start: iso(year, month0, 1), end: iso(year, month0, 15) };
  }
  return { issueNumber: index, start: iso(year, month0, 16), end: iso(year, month0, lastDay(year, month0)) };
}

export function currentPeriod(now: Date = new Date()): Period {
  return periodFromIndex(fortnightIndex(now));
}

export function previousPeriod(now: Date = new Date()): Period {
  return periodFromIndex(Math.max(1, fortnightIndex(now) - 1));
}

export function periodLabel(start: string, end: string): string {
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  if (sy === ey && sm === em) return `${sd} to ${ed} ${MONTHS[em - 1]} ${ey}`;
  if (sy === ey) return `${sd} ${MONTHS[sm - 1]} to ${ed} ${MONTHS[em - 1]} ${ey}`;
  return `${sd} ${MONTHS[sm - 1]} ${sy} to ${ed} ${MONTHS[em - 1]} ${ey}`;
}

export function formatIssueNumber(n: number): string {
  return `Issue ${String(n).padStart(2, "0")}`;
}

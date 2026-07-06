export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const usd = (n: number) =>
  "USD " + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

export const num = (n: number) => n.toLocaleString("en-US");

// Rounds to one decimal and drops a trailing ".0" so abbreviations stay short.
function oneDecimal(v: number): string {
  return (Math.round(v * 10) / 10).toString();
}

// Shortens large numbers into K / M / B with at most one decimal, and falls
// back to comma grouping below a thousand. e.g. 5_000_000 -> "5M",
// 5_200_000 -> "5.2M", 331_900_000 -> "331.9M", 12_500 -> "12.5K".
export function compact(n: number): string {
  if (!Number.isFinite(n)) return "0";
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1e9) return sign + oneDecimal(abs / 1e9) + "B";
  if (abs >= 1e6) return sign + oneDecimal(abs / 1e6) + "M";
  if (abs >= 1e3) return sign + oneDecimal(abs / 1e3) + "K";
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

// Stable identifier derived from a product name. Lets products share HS codes
// while staying uniquely selectable.
export const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

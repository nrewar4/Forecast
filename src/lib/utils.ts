export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const usd = (n: number) =>
  "USD " + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

export const num = (n: number) => n.toLocaleString("en-US");

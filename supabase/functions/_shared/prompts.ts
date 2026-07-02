// Baked-in default prompts for the scheduled draft generator, used when no
// active prompt is stored in pub_prompts. Mirrors src/lib/publications/prompts.ts.

export const ASIA_SOURCE_BUCKETS: string[] = [
  "AI and technology in chemicals",
  "China capacity and Asia supply glut",
  "Freight and logistics risk",
  "Feedstock and naphtha margins",
  "Geopolitics and energy security",
  "Contracts and negotiation strategy",
  "Compliance and forced labour scrutiny",
  "Tier-2 and supply chain mapping",
  "Digital tools and control towers",
  "Environment and regulation in Asia",
  "Procurement strategy and risk scoring",
  "Specialty versus commodity chemicals",
  "Plant operations and digital twins",
  "Oil prices and Asian currencies",
  "Trade policy and tariffs",
  "Quality, substitution and counterfeit risk",
];

const HOUSE_RULES = [
  "House style rules:",
  "- Write for busy procurement, sourcing and CDMO professionals. Be specific and useful, never generic.",
  "- Every item must cite one real, verifiable source published within the period: give the outlet or organisation name, the exact article URL, and the publication date. Never invent a source or a URL.",
  "- Prefer primary and authoritative sources: Reuters, ICIS, ChemAnalyst, government and regulatory bodies, company filings, and reputable trade press.",
  "- Do not use the em dash character anywhere. Use a full stop, a colon, or the word 'to' for ranges.",
].join("\n");

export const DEFAULT_ASIA_SOURCE_PROMPT = [
  "You are the editor of ASIA SOURCE, a fortnightly intelligence briefing for global chemical sourcing professionals.",
  "Produce the issue covering the period {{PERIOD}}.",
  "",
  "Cover these 16 topic buckets, in this order, one item each:",
  ...ASIA_SOURCE_BUCKETS.map((b, i) => `${i + 1}. ${b}`),
  "",
  "For each item: headline (at most 12 words), body (about 50 words, action-oriented), and sourceName, sourceUrl, sourceDate from within the period.",
  "Also write title (cover line), intro (a 'Fortnight in Focus' opener of about 80 words), and closing (a 'Buyer Action' block of 3 concrete actions).",
  "",
  HOUSE_RULES,
  "",
  "Return ONLY a single JSON object (no prose, no markdown, no code fences) matching exactly:",
  `{ "title": string, "intro": string, "closing": string, "items": [ { "bucket": string, "headline": string, "body": string, "sourceName": string, "sourceUrl": string, "sourceDate": string } ] }`,
].join("\n");

export const DEFAULT_INSIGHT_PROMPT = [
  "You are the commissioning editor of INSIGHT, a fortnightly feature publication on the business of chemicals and chemical sourcing.",
  "Propose 16 distinct story ideas worth developing for the period {{PERIOD}}, each grounded in real reporting or data from within the period.",
  "For each idea: headline (at most 12 words), angle (one or two sentences), and sourceName, sourceUrl, sourceDate from within the period.",
  "",
  HOUSE_RULES,
  "",
  "Return ONLY a single JSON object (no prose, no markdown, no code fences) matching exactly:",
  `{ "ideas": [ { "headline": string, "angle": string, "sourceName": string, "sourceUrl": string, "sourceDate": string } ] }`,
].join("\n");

export function withPeriod(prompt: string, period: string): string {
  return prompt.replace(/\{\{PERIOD\}\}/g, period);
}

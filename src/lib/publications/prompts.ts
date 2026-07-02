// Default master prompts for the two publications, plus the Asia Source topic
// buckets. These are the starting point; editors evolve them issue by issue in
// the Studio (each save becomes a new version). The token {{PERIOD}} is replaced
// with the fortnight label before the prompt is sent to the model.

import type { PublicationSlug } from "./types";

// The 16 topic buckets that shape an Asia Source issue. Order is the default
// running order; the editor can reorder and exclude items after generation.
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

// Rules shared by both publications so the house style stays consistent.
const HOUSE_RULES = [
  "House style rules:",
  "- Write for busy procurement, sourcing and CDMO professionals. Be specific and useful, never generic.",
  "- Every item must cite one real, verifiable source published within the period: give the outlet or organisation name, the exact article URL, and the publication date. Never invent a source or a URL. If you cannot find a real source for a bucket, say so honestly in that item rather than fabricating one.",
  "- Prefer primary and authoritative sources: Reuters, ICIS, ChemAnalyst, government and regulatory bodies, company filings, and reputable trade press.",
  "- Do not use the em dash character anywhere. Use a full stop, a colon, or the word 'to' for ranges.",
  "- Keep numbers concrete (prices, tonnages, percentages, dates) and attribute them to the source.",
].join("\n");

export const DEFAULT_ASIA_SOURCE_PROMPT = [
  "You are the editor of ASIA SOURCE, a fortnightly intelligence briefing for global chemical sourcing professionals.",
  "Produce the issue covering the period {{PERIOD}}.",
  "",
  "Cover these 16 topic buckets, in this order, one item each:",
  ...ASIA_SOURCE_BUCKETS.map((b, i) => `${i + 1}. ${b}`),
  "",
  "For each item:",
  "- headline: a punchy title, at most 12 words, no trailing punctuation.",
  "- body: about 50 words of analysis a buyer can act on. Lead with what happened, then the sourcing implication.",
  "- sourceName, sourceUrl, sourceDate: one real source from within the period.",
  "",
  "Also write:",
  "- title: the issue's cover line.",
  "- intro: a 'Fortnight in Focus' opener of about 80 words that frames the two or three biggest themes.",
  "- closing: a 'Buyer Action' block of 3 concrete actions for the next fortnight.",
  "",
  HOUSE_RULES,
  "",
  "Return ONLY a single JSON object (no prose, no markdown, no code fences) matching exactly:",
  `{
  "title": string,
  "intro": string,
  "closing": string,
  "items": [
    { "bucket": string, "headline": string, "body": string,
      "sourceName": string, "sourceUrl": string, "sourceDate": string }
  ]   // exactly 16 items, in the bucket order above
}`,
].join("\n");

export const DEFAULT_INSIGHT_PROMPT = [
  "You are the commissioning editor of INSIGHT, a fortnightly feature publication on the business of chemicals and chemical sourcing.",
  "Propose 16 distinct story ideas worth developing for the period {{PERIOD}}.",
  "Each idea must be grounded in real reporting or data from within the period, not invented.",
  "Aim for range: markets, technology, regulation, supply chains, company strategy, and sustainability.",
  "",
  "For each idea:",
  "- headline: the working title, at most 12 words.",
  "- angle: one or two sentences on the story's argument and why it matters to a sourcing audience.",
  "- sourceName, sourceUrl, sourceDate: one real source from within the period that seeds the story.",
  "",
  HOUSE_RULES,
  "",
  "Return ONLY a single JSON object (no prose, no markdown, no code fences) matching exactly:",
  `{
  "ideas": [
    { "headline": string, "angle": string,
      "sourceName": string, "sourceUrl": string, "sourceDate": string }
  ]   // exactly 16 ideas
}`,
].join("\n");

// Second Insight stage: expand one chosen idea into a full article. The chosen
// idea is appended as JSON when this prompt is used.
export const DEFAULT_INSIGHT_ARTICLE_PROMPT = [
  "You are a senior writer for INSIGHT. Develop the chosen story idea into a finished feature article.",
  "Length: 700 to 900 words. Structure: a strong opening, 3 to 5 short sections with subheadings, and a forward-looking close.",
  "Ground every claim in real, verifiable reporting from around the period {{PERIOD}}. Do not invent sources.",
  "",
  HOUSE_RULES,
  "",
  "Return ONLY a single JSON object (no prose, no markdown, no code fences) matching exactly:",
  `{
  "title": string,          // final headline
  "intro": string,          // one sentence standfirst / lede
  "body": string,           // the full article in Markdown, with ## subheadings
  "sources": [ { "sourceName": string, "sourceUrl": string, "sourceDate": string } ]
}`,
].join("\n");

export function defaultPromptFor(pub: PublicationSlug): string {
  return pub === "asia-source" ? DEFAULT_ASIA_SOURCE_PROMPT : DEFAULT_INSIGHT_PROMPT;
}

// Substitutes the period label into a stored prompt.
export function withPeriod(prompt: string, periodLabelText: string): string {
  return prompt.replace(/\{\{PERIOD\}\}/g, periodLabelText);
}

// Client-side draft generation for both publications. Mirrors the approach in
// src/lib/aiResearch.ts: prefer a web-grounded completion, fall back to a plain
// one, then strip code fences and parse JSON defensively. This powers the
// "Generate now" button in the Studio. The scheduled path runs the same idea in
// a Supabase Edge Function with the key kept server-side.

import type { AiConfig } from "../aiConfig";
import { chatComplete, type ChatMsg } from "../openrouter";
import { withPeriod } from "./prompts";
import type { StoryIdea } from "./types";

export type AsiaSourceDraft = {
  title: string;
  intro: string;
  closing: string;
  items: {
    bucket: string;
    headline: string;
    body: string;
    sourceName: string;
    sourceUrl: string;
    sourceDate: string;
  }[];
};

export type InsightArticleDraft = {
  title: string;
  intro: string;
  body: string;
  sources: { sourceName: string; sourceUrl: string; sourceDate: string }[];
};

// Runs the model with web grounding, falling back to a plain completion.
async function complete(cfg: AiConfig, system: string, user: string, signal?: AbortSignal): Promise<string> {
  const messages: ChatMsg[] = [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
  try {
    return await chatComplete(cfg, messages, signal, { web: true });
  } catch (e) {
    if (signal?.aborted) throw e;
    return await chatComplete(cfg, messages, signal);
  }
}

// Pulls the first balanced JSON object out of a model response.
function parseJson<T>(raw: string): T {
  let text = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) text = text.slice(start, end + 1);
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("The model did not return readable JSON. Try again or adjust the prompt.");
  }
}

const str = (v: unknown): string => (typeof v === "string" ? v : "");

export async function generateAsiaSourceDraft(
  cfg: AiConfig,
  promptContent: string,
  periodLabelText: string,
  signal?: AbortSignal,
): Promise<AsiaSourceDraft> {
  const system = withPeriod(promptContent, periodLabelText);
  const raw = await complete(cfg, system, `Produce the Asia Source issue for ${periodLabelText}.`, signal);
  const obj = parseJson<Partial<AsiaSourceDraft>>(raw);
  const items = Array.isArray(obj.items) ? obj.items : [];
  return {
    title: str(obj.title) || `Asia Source: ${periodLabelText}`,
    intro: str(obj.intro),
    closing: str(obj.closing),
    items: items.map((it) => ({
      bucket: str(it?.bucket),
      headline: str(it?.headline),
      body: str(it?.body),
      sourceName: str(it?.sourceName),
      sourceUrl: str(it?.sourceUrl),
      sourceDate: str(it?.sourceDate),
    })),
  };
}

export async function generateInsightIdeas(
  cfg: AiConfig,
  promptContent: string,
  periodLabelText: string,
  signal?: AbortSignal,
): Promise<StoryIdea[]> {
  const system = withPeriod(promptContent, periodLabelText);
  const raw = await complete(cfg, system, `Propose 16 Insight story ideas for ${periodLabelText}.`, signal);
  const obj = parseJson<{ ideas?: Partial<StoryIdea>[] }>(raw);
  const ideas = Array.isArray(obj.ideas) ? obj.ideas : [];
  return ideas.map((it) => ({
    headline: str(it?.headline),
    angle: str(it?.angle),
    sourceName: str(it?.sourceName),
    sourceUrl: str(it?.sourceUrl),
    sourceDate: str(it?.sourceDate),
  }));
}

export async function expandInsightIdea(
  cfg: AiConfig,
  articlePrompt: string,
  idea: StoryIdea,
  periodLabelText: string,
  signal?: AbortSignal,
): Promise<InsightArticleDraft> {
  const system = withPeriod(articlePrompt, periodLabelText);
  const user = `Develop this story idea into a full article:\n${JSON.stringify(idea, null, 2)}`;
  const raw = await complete(cfg, system, user, signal);
  const obj = parseJson<Partial<InsightArticleDraft>>(raw);
  const sources = Array.isArray(obj.sources) ? obj.sources : [];
  return {
    title: str(obj.title) || idea.headline,
    intro: str(obj.intro),
    body: str(obj.body),
    sources: sources.map((s) => ({
      sourceName: str(s?.sourceName),
      sourceUrl: str(s?.sourceUrl),
      sourceDate: str(s?.sourceDate),
    })),
  };
}

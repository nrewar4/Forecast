// Shared types for the Publications feature (Asia Source and Insight). These
// mirror the Supabase columns closely so the store can map between camelCase and
// snake_case without surprises. Everything also works against localStorage when
// Supabase is not configured.

export type PublicationSlug = "asia-source" | "insight";

// asia-source issues are always "issue" (the 16 item briefing).
// insight has two draft shapes: "ideas" (16 story ideas to pick from) and
// "article" (the single chosen story expanded into a full read).
export type IssueKind = "issue" | "ideas" | "article";

export type IssueStatus = "draft" | "published";

export type Issue = {
  id: string;
  publication: PublicationSlug;
  kind: IssueKind;
  issueNumber: number;
  periodStart: string; // ISO date (YYYY-MM-DD)
  periodEnd: string; // ISO date (YYYY-MM-DD)
  status: IssueStatus;
  title: string;
  intro: string; // "Fortnight in Focus" for asia-source; lede for an article
  body: string; // long-form markdown for insight articles; empty for asia-source
  closing: string; // "Buyer Action" for asia-source
  publishedAt?: string;
  createdAt: string;
};

export type IssueItem = {
  id: string;
  issueId: string;
  position: number; // 1-based order
  bucket: string; // the topic bucket this item covers
  headline: string;
  body: string;
  sourceName: string;
  sourceUrl: string;
  sourceDate: string; // free text or YYYY-MM-DD as returned by the model
  included: boolean; // human curation toggle
};

export type PromptVersion = {
  id: string;
  publication: PublicationSlug;
  version: number;
  content: string;
  note: string;
  isActive: boolean;
  createdAt: string;
};

// A single Insight story idea before it is developed into an article.
export type StoryIdea = {
  headline: string;
  angle: string;
  sourceName: string;
  sourceUrl: string;
  sourceDate: string;
};

export type Subscriber = {
  email: string;
  publications: PublicationSlug[];
};

// The label shown in the UI for each publication.
export const PUBLICATION_LABELS: Record<PublicationSlug, string> = {
  "asia-source": "Asia Source",
  insight: "Insight",
};

export const PUBLICATION_TAGLINES: Record<PublicationSlug, string> = {
  "asia-source": "Fortnightly intelligence for global chemical sourcing",
  insight: "Fortnightly features on the business of chemicals",
};

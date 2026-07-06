// Renders a branded 1080x1080 PNG summary card for an issue, for sharing to
// Instagram (which has no web share intent). The card lists the issue's top
// headlines on the APAC orange and white palette. Fonts are loaded before
// drawing so the card renders in Inter rather than a fallback face.

import type { Issue, IssueItem } from "./publications/types";
import { periodLabel, formatIssueNumber } from "./publications/fortnight";
import { PUBLICATION_LABELS } from "./publications/types";

const SIZE = 1080;
const ORANGE = "#F47920";
const INK = "#0F172A";
const MUTED = "#64748B";

async function ensureFonts() {
  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.load("700 48px Inter");
      await document.fonts.load("600 34px Inter");
      await document.fonts.load("400 26px Inter");
      await document.fonts.ready;
    }
  } catch {
    // Fonts API not available; the canvas falls back to a system face.
  }
}

// Wraps text to a max width, returning the lines. Caller positions them.
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines - 1) break;
    } else {
      line = test;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    lines[maxLines - 1] = lines[maxLines - 1].replace(/[.,]?$/, "") + "...";
  }
  return lines;
}

export async function renderIssueCard(issue: Issue, items: IssueItem[]): Promise<Blob> {
  await ensureFonts();
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");

  // Background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Masthead bar
  ctx.fillStyle = ORANGE;
  ctx.fillRect(0, 0, SIZE, 150);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "800 52px Inter, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(PUBLICATION_LABELS[issue.publication].toUpperCase(), 72, 78);

  // Issue meta
  ctx.fillStyle = MUTED;
  ctx.font = "600 30px Inter, sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(
    `${formatIssueNumber(issue.issueNumber)}  ·  ${periodLabel(issue.periodStart, issue.periodEnd)}`,
    72,
    230,
  );

  // Cover title
  ctx.fillStyle = INK;
  ctx.font = "700 56px Inter, sans-serif";
  const titleLines = wrapText(ctx, issue.title, SIZE - 144, 3);
  let y = 320;
  for (const l of titleLines) {
    ctx.fillText(l, 72, y);
    y += 70;
  }

  // Top headlines
  const included = items.filter((i) => i.included).slice(0, 5);
  y += 30;
  for (let i = 0; i < included.length; i++) {
    const item = included[i];
    // Number chip
    ctx.fillStyle = ORANGE;
    ctx.font = "800 30px Inter, sans-serif";
    ctx.fillText(String(i + 1).padStart(2, "0"), 72, y);
    // Headline
    ctx.fillStyle = INK;
    ctx.font = "600 34px Inter, sans-serif";
    const lines = wrapText(ctx, item.headline, SIZE - 220, 2);
    let ly = y;
    for (const l of lines) {
      ctx.fillText(l, 150, ly);
      ly += 44;
    }
    y = ly + 30;
  }

  // Footer
  ctx.fillStyle = ORANGE;
  ctx.fillRect(0, SIZE - 90, SIZE, 90);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "600 28px Inter, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText("APAC Sourcing Intelligence  ·  apacss.com", 72, SIZE - 45);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not render the image."));
    }, "image/png");
  });
}

export function issueCaption(issue: Issue, items: IssueItem[], url: string): string {
  const included = items.filter((i) => i.included).slice(0, 5);
  const lines = [
    `${PUBLICATION_LABELS[issue.publication]} ${formatIssueNumber(issue.issueNumber)}`,
    periodLabel(issue.periodStart, issue.periodEnd),
    "",
    issue.title,
    "",
    ...included.map((i) => `- ${i.headline}`),
    "",
    `Read the full issue: ${url}`,
    "",
    "#chemicals #sourcing #supplychain #procurement #APAC",
  ];
  return lines.join("\n");
}

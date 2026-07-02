// Dependency-free HTML email renderer, shared by the send-issue function and (if
// wanted) an in-app preview. Uses a table-based, inline-styled 600px layout and a
// system font stack, which is what Gmail and Outlook render reliably. No em dash
// anywhere, matching house style.

import { formatIssueNumber, periodLabel } from "./fortnight.ts";

export type EmailIssue = {
  publication: string;
  kind: string;
  issueNumber: number;
  periodStart: string;
  periodEnd: string;
  title: string;
  intro: string;
  body: string;
  closing: string;
};

export type EmailItem = {
  position: number;
  bucket: string;
  headline: string;
  body: string;
  sourceName: string;
  sourceUrl: string;
  sourceDate: string;
  included: boolean;
};

const ORANGE = "#F47920";
const INK = "#0F172A";
const MUTED = "#64748B";
const BORDER = "#E2E8F0";
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const PUBLICATION_LABELS: Record<string, string> = {
  "asia-source": "ASIA SOURCE",
  insight: "INSIGHT",
};

function esc(s: string): string {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Very small Markdown to HTML for Insight article bodies (## headings, blank
// line paragraphs, - bullets). Enough for the email; the web reader is richer.
function markdownToHtml(md: string): string {
  const lines = (md || "").replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flushP = () => {
    if (para.length) {
      out.push(
        `<p style="margin:0 0 14px;color:${INK};font-size:15px;line-height:1.6">${esc(para.join(" "))}</p>`,
      );
      para = [];
    }
  };
  const flushL = () => {
    if (list.length) {
      out.push(
        `<ul style="margin:0 0 14px;padding-left:20px;color:${INK};font-size:15px;line-height:1.6">${list
          .map((li) => `<li>${esc(li)}</li>`)
          .join("")}</ul>`,
      );
      list = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushP();
      flushL();
    } else if (/^###?\s+/.test(line)) {
      flushP();
      flushL();
      out.push(
        `<h3 style="margin:22px 0 10px;color:${INK};font-size:18px;font-weight:700">${esc(
          line.replace(/^###?\s+/, ""),
        )}</h3>`,
      );
    } else if (/^[-*]\s+/.test(line)) {
      flushP();
      list.push(line.replace(/^[-*]\s+/, ""));
    } else {
      flushL();
      para.push(line);
    }
  }
  flushP();
  flushL();
  return out.join("");
}

function sourceLine(item: EmailItem): string {
  if (!item.sourceName) return "";
  const name = item.sourceUrl
    ? `<a href="${esc(item.sourceUrl)}" style="color:${ORANGE};text-decoration:none">${esc(item.sourceName)}</a>`
    : esc(item.sourceName);
  const date = item.sourceDate ? `, ${esc(item.sourceDate)}` : "";
  return `<div style="margin-top:6px;color:${MUTED};font-size:12px">Source: ${name}${date}</div>`;
}

function briefingItems(items: EmailItem[]): string {
  const included = items.filter((i) => i.included).sort((a, b) => a.position - b.position);
  return included
    .map(
      (item, i) => `
      <tr><td style="padding:18px 0;border-top:1px solid ${BORDER}">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td valign="top" width="42" style="color:${ORANGE};font-size:22px;font-weight:800;line-height:1">${String(
            i + 1,
          ).padStart(2, "0")}</td>
          <td valign="top">
            <div style="color:${MUTED};font-size:11px;text-transform:uppercase;letter-spacing:.08em;font-weight:600">${esc(
              item.bucket,
            )}</div>
            <div style="margin-top:2px;color:${INK};font-size:17px;font-weight:700;line-height:1.3">${esc(
              item.headline,
            )}</div>
            <div style="margin-top:6px;color:${INK};font-size:14px;line-height:1.6">${esc(item.body)}</div>
            ${sourceLine(item)}
          </td>
        </tr></table>
      </td></tr>`,
    )
    .join("");
}

export function renderIssueEmail(
  issue: EmailIssue,
  items: EmailItem[],
  opts: { webUrl: string; unsubscribeUrl: string },
): string {
  const label = PUBLICATION_LABELS[issue.publication] ?? issue.publication.toUpperCase();
  const period = periodLabel(issue.periodStart, issue.periodEnd);
  const isArticle = issue.kind === "article";

  const bodyBlock = isArticle
    ? `${issue.intro ? `<p style="margin:0 0 16px;color:${INK};font-size:17px;font-weight:600;line-height:1.5">${esc(issue.intro)}</p>` : ""}
       ${markdownToHtml(issue.body)}
       ${
         items.length
           ? `<div style="margin-top:20px;padding:16px;background:#F8FAFC;border-radius:10px">
                <div style="color:${MUTED};font-size:11px;text-transform:uppercase;letter-spacing:.08em;font-weight:600">Sources</div>
                ${items
                  .map(
                    (s) =>
                      `<div style="margin-top:6px;font-size:13px">${
                        s.sourceUrl
                          ? `<a href="${esc(s.sourceUrl)}" style="color:${ORANGE};text-decoration:none">${esc(s.sourceName)}</a>`
                          : esc(s.sourceName)
                      }${s.sourceDate ? `, ${esc(s.sourceDate)}` : ""}</div>`,
                  )
                  .join("")}
              </div>`
           : ""
       }`
    : `${
        issue.intro
          ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:16px;background:#FDEEE2;border-radius:12px">
               <div style="color:${ORANGE};font-size:11px;text-transform:uppercase;letter-spacing:.12em;font-weight:700">Fortnight in Focus</div>
               <div style="margin-top:6px;color:${INK};font-size:15px;line-height:1.6">${esc(issue.intro)}</div>
             </td></tr></table>`
          : ""
      }
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px">${briefingItems(items)}</table>
      ${
        issue.closing
          ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px"><tr><td style="padding:16px;border:2px solid #FACBA6;border-radius:12px;background:#FEF4EC">
               <div style="color:${ORANGE};font-size:11px;text-transform:uppercase;letter-spacing:.12em;font-weight:700">Buyer Action</div>
               <div style="margin-top:6px;color:${INK};font-size:15px;line-height:1.6">${esc(issue.closing)}</div>
             </td></tr></table>`
          : ""
      }`;

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:${FONT}">
  <div style="display:none;max-height:0;overflow:hidden">${esc(issue.title || label)} — ${esc(period)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
        <tr><td style="background:${ORANGE};padding:20px 28px">
          <div style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:.02em">${esc(label)}</div>
        </td></tr>
        <tr><td style="padding:24px 28px 8px">
          <div style="color:${MUTED};font-size:13px;font-weight:600">${esc(formatIssueNumber(issue.issueNumber))} &nbsp;·&nbsp; ${esc(period)}</div>
          ${issue.title ? `<h1 style="margin:8px 0 0;color:${INK};font-size:24px;line-height:1.25;font-weight:800">${esc(issue.title)}</h1>` : ""}
        </td></tr>
        <tr><td style="padding:12px 28px 24px">${bodyBlock}</td></tr>
        <tr><td style="padding:20px 28px;border-top:1px solid ${BORDER}">
          <a href="${esc(opts.webUrl)}" style="color:${ORANGE};font-size:14px;font-weight:700;text-decoration:none">Read this issue on the web</a>
          <div style="margin-top:10px;color:${MUTED};font-size:12px;line-height:1.6">
            You are receiving this because you subscribed to APAC Sourcing Intelligence publications.<br>
            <a href="${esc(opts.unsubscribeUrl)}" style="color:${MUTED};text-decoration:underline">Unsubscribe</a>
          </div>
        </td></tr>
      </table>
      <div style="color:#94A3B8;font-size:11px;margin-top:14px">APAC Sourcing Intelligence · apacss.com</div>
    </td></tr>
  </table>
</body></html>`;
}

export function issueSubject(issue: EmailIssue): string {
  const label = PUBLICATION_LABELS[issue.publication] ?? issue.publication.toUpperCase();
  return `${label} ${formatIssueNumber(issue.issueNumber)}: ${periodLabel(issue.periodStart, issue.periodEnd)}`;
}

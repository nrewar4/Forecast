import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// A minimal Markdown renderer for Insight article bodies. It handles the subset
// the article prompt produces: ## and ### headings, blank-line-separated
// paragraphs, - / * bullet lists, and inline **bold** and *italic*. This avoids
// pulling in a full Markdown dependency for one surface.

function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(<Fragment key={`${keyBase}-t${i}`}>{text.slice(last, m.index)}</Fragment>);
    if (m[2] !== undefined) {
      nodes.push(<strong key={`${keyBase}-b${i}`}>{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      nodes.push(<em key={`${keyBase}-i${i}`}>{m[3]}</em>);
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(<Fragment key={`${keyBase}-tend`}>{text.slice(last)}</Fragment>);
  return nodes;
}

export default function MarkdownBody({ markdown, className }: { markdown: string; className?: string }) {
  const lines = (markdown || "").replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let key = 0;

  function flushParagraph() {
    if (paragraph.length) {
      const text = paragraph.join(" ");
      blocks.push(
        <p key={`p${key++}`} className="mt-4 leading-relaxed text-foreground/90">
          {renderInline(text, `p${key}`)}
        </p>,
      );
      paragraph = [];
    }
  }
  function flushList() {
    if (list.length) {
      const items = list.slice();
      blocks.push(
        <ul key={`u${key++}`} className="mt-4 list-disc space-y-1.5 pl-5 text-foreground/90">
          {items.map((li, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(li, `u${key}-${idx}`)}
            </li>
          ))}
        </ul>,
      );
      list = [];
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }
    if (/^###\s+/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push(
        <h4 key={`h${key++}`} className="mt-6 text-base font-semibold text-ink">
          {renderInline(line.replace(/^###\s+/, ""), `h${key}`)}
        </h4>,
      );
    } else if (/^##\s+/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push(
        <h3 key={`h${key++}`} className="mt-8 text-xl font-bold tracking-tight text-ink">
          {renderInline(line.replace(/^##\s+/, ""), `h${key}`)}
        </h3>,
      );
    } else if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      list.push(line.replace(/^[-*]\s+/, ""));
    } else {
      flushList();
      paragraph.push(line.trim());
    }
  }
  flushParagraph();
  flushList();

  return <div className={cn("text-[15px]", className)}>{blocks}</div>;
}

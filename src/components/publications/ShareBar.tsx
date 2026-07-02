import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download, Instagram, Linkedin, Share2, X } from "lucide-react";
import {
  canNativeShare,
  canShareFiles,
  copyToClipboard,
  linkedInShareUrl,
  nativeShare,
  shareFiles,
  tweetIntentUrl,
} from "@/lib/share";
import { issueCaption, renderIssueCard } from "@/lib/imageCard";
import type { Issue, IssueItem } from "@/lib/publications/types";
import { PUBLICATION_LABELS } from "@/lib/publications/types";
import { cn } from "@/lib/utils";

// X logo is not in lucide; a tiny inline glyph keeps the row on brand.
function XGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.86l-5.37-7.02L4.6 22H1.34l8.02-9.17L1 2h7.03l4.86 6.43L18.24 2Zm-1.2 18h1.9L7.03 4H5l12.04 16Z" />
    </svg>
  );
}

function iconBtnClass(active = false) {
  return cn(
    "press inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary",
    active && "border-primary/50 text-primary",
  );
}

export function ShareBar({
  issue,
  items,
  url,
  className,
}: {
  issue: Issue;
  items: IssueItem[];
  url: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [instaOpen, setInstaOpen] = useState(false);
  const shareText = `${PUBLICATION_LABELS[issue.publication]}: ${issue.title}`;

  async function onCopy() {
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2 print:hidden", className)}>
      <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Share
      </span>
      <a
        href={linkedInShareUrl(url)}
        target="_blank"
        rel="noreferrer noopener"
        className={iconBtnClass()}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
        <span className="hidden sm:inline">LinkedIn</span>
      </a>
      <a
        href={tweetIntentUrl(shareText, url)}
        target="_blank"
        rel="noreferrer noopener"
        className={iconBtnClass()}
        aria-label="Share on X"
      >
        <XGlyph className="h-4 w-4" />
        <span className="hidden sm:inline">X</span>
      </a>
      <button type="button" onClick={() => setInstaOpen(true)} className={iconBtnClass()} aria-label="Share to Instagram">
        <Instagram className="h-4 w-4" />
        <span className="hidden sm:inline">Instagram</span>
      </button>
      <button type="button" onClick={onCopy} className={iconBtnClass(copied)} aria-label="Copy link">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span className="hidden sm:inline">{copied ? "Copied" : "Copy link"}</span>
      </button>
      {canNativeShare() ? (
        <button
          type="button"
          onClick={() => nativeShare({ title: shareText, text: shareText, url })}
          className={iconBtnClass()}
          aria-label="Share"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">More</span>
        </button>
      ) : null}

      {instaOpen ? (
        <InstagramDialog issue={issue} items={items} url={url} onClose={() => setInstaOpen(false)} />
      ) : null}
    </div>
  );
}

function InstagramDialog({
  issue,
  items,
  url,
  onClose,
}: {
  issue: Issue;
  items: IssueItem[];
  url: string;
  onClose: () => void;
}) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captionCopied, setCaptionCopied] = useState(false);
  const caption = issueCaption(issue, items, url);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    renderIssueCard(issue, items)
      .then((b) => {
        if (cancelled) return;
        setBlob(b);
        const u = URL.createObjectURL(b);
        objectUrlRef.current = u;
        setImgUrl(u);
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Could not render the image."));
    return () => {
      cancelled = true;
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, [issue, items]);

  // Close on Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function download() {
    if (!imgUrl) return;
    const a = document.createElement("a");
    a.href = imgUrl;
    a.download = `${issue.publication}-issue-${String(issue.issueNumber).padStart(2, "0")}.png`;
    a.click();
  }

  async function copyCaption() {
    const ok = await copyToClipboard(caption);
    if (ok) {
      setCaptionCopied(true);
      setTimeout(() => setCaptionCopied(false), 1800);
    }
  }

  const file = blob ? new File([blob], `${issue.publication}-issue.png`, { type: "image/png" }) : null;
  const canShareImage = !!file && canShareFiles([file]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 print:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Share to Instagram"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-background p-5 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-ink">Share to Instagram</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Instagram has no web posting link, so download this image, then post it from the Instagram
              app with the caption below. On a phone you can use Share image to open Instagram directly.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="press rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-muted">
          {error ? (
            <p className="p-6 text-center text-sm text-rose-600">{error}</p>
          ) : imgUrl ? (
            <img src={imgUrl} alt="Issue summary card preview" className="mx-auto block w-full max-w-xs" />
          ) : (
            <div className="grid h-64 place-items-center text-sm text-muted-foreground">
              Rendering card...
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={download}
            disabled={!imgUrl}
            className="press inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600 disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            Download image
          </button>
          <button
            type="button"
            onClick={copyCaption}
            className={iconBtnClass(captionCopied)}
          >
            {captionCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {captionCopied ? "Caption copied" : "Copy caption"}
          </button>
          {canShareImage ? (
            <button
              type="button"
              onClick={() => file && shareFiles([file], { title: issue.title, text: caption })}
              className={iconBtnClass()}
            >
              <Share2 className="h-4 w-4" />
              Share image
            </button>
          ) : null}
        </div>

        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Caption
          </p>
          <textarea
            readOnly
            value={caption}
            rows={6}
            className="w-full rounded-lg border border-border bg-muted/50 p-3 text-xs leading-relaxed text-foreground outline-none"
          />
        </div>
      </div>
    </div>
  );
}

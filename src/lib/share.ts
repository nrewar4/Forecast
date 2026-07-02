// Social sharing helpers. LinkedIn and X (Twitter) expose share intent URLs that
// open a prefilled composer. There is no web intent for Instagram, so the UI
// handles that separately with a downloadable image card (see imageCard.ts).

export function linkedInShareUrl(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

export function tweetIntentUrl(text: string, url: string): string {
  const params = new URLSearchParams({ text, url });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

// Facebook sharer, included because it also accepts a quote.
export function facebookShareUrl(url: string, quote: string): string {
  const params = new URLSearchParams({ u: url, quote });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function canNativeShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export async function nativeShare(data: { title?: string; text?: string; url?: string }): Promise<boolean> {
  if (!canNativeShare()) return false;
  try {
    await navigator.share(data);
    return true;
  } catch {
    return false; // user cancelled or share failed
  }
}

// True when the browser can share the given files (needed for the Instagram
// image flow on mobile, where the OS share sheet surfaces Instagram).
export function canShareFiles(files: File[]): boolean {
  try {
    return (
      typeof navigator !== "undefined" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files })
    );
  } catch {
    return false;
  }
}

export async function shareFiles(files: File[], data: { title?: string; text?: string }): Promise<boolean> {
  if (!canShareFiles(files)) return false;
  try {
    await navigator.share({ ...data, files });
    return true;
  } catch {
    return false;
  }
}

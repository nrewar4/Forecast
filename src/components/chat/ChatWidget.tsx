import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { ChatPanel } from "./ChatPanel";

// Floating assistant, mounted once at the app root so the conversation persists
// across route changes. Hidden on the login screen and wherever the page hosts
// its own embedded assistant (the CDMO page sets data-embedded-chat on <body>).
export function ChatWidget() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pageHasEmbed, setPageHasEmbed] = useState(false);

  // Detect a page-level embedded assistant so we do not show two at once.
  useEffect(() => {
    const check = () => setPageHasEmbed(document.body.dataset.embeddedChat === "1");
    check();
    const t = setTimeout(check, 60); // after the route's first paint
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (open && !mounted) setMounted(true);
  }, [open, mounted]);

  if (pathname === "/login" || pageHasEmbed) return null;

  function toggle() {
    setOpen((o) => {
      const next = !o;
      if (next) track("chat_open", { from: pathname });
      return next;
    });
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end print:hidden">
      {open ? (
        <div className="mb-3 flex h-[min(90vh,880px)] w-[min(96vw,800px)] animate-chat-pop flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-lift">
          <div className="flex items-center justify-between border-b border-border bg-ink px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">APAC Assistant</p>
              <p className="text-[11px] text-slate-300">Ask about any product or project</p>
            </div>
            <button
              type="button"
              onClick={toggle}
              aria-label="Close assistant"
              className="press grid h-8 w-8 place-items-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {mounted ? <ChatPanel variant="floating" /> : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={toggle}
        aria-label={open ? "Close assistant" : "Open the APAC assistant"}
        className={cn(
          "press group grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow transition-transform duration-200 ease-spring hover:scale-105",
          open && "rotate-90",
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </div>
  );
}

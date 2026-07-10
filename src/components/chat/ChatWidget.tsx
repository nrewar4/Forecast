import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquare, X } from "lucide-react";
import { ChatPanel } from "./ChatPanel";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// Floating assistant, persistent across navigation. Hidden on the login page, on
// /cdmo (which embeds the assistant inline), and on the internal admin tools
// (the assistant is a visitor lead-gen surface, not an analyst tool).
const HIDE_ON = new Set(["/login", "/cdmo", "/admin", "/trade-analytics", "/demand-forecast", "/documents", "/synthesis-routes"]);

export function ChatWidget() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const hidden = HIDE_ON.has(pathname);

  useEffect(() => {
    if (hidden && open) setOpen(false);
  }, [hidden, open]);

  if (hidden) return null;

  return (
    <>
      {/* Panel */}
      <div
        className={cn(
          "fixed bottom-24 right-4 z-50 flex w-[min(400px,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-lift transition-[opacity,transform] duration-200 ease-out-expo",
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
        )}
        style={{ height: "min(600px, calc(100vh - 8rem))" }}
        role="dialog"
        aria-label="APAC assistant"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">APAC Assistant</p>
              <p className="text-[11px] text-muted-foreground">Map a path or check a molecule</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="press grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close assistant"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {open ? <ChatPanel /> : null}
      </div>

      {/* Launcher */}
      <button
        type="button"
        onClick={() => {
          setOpen((v) => {
            if (!v) track("chat_open", { from: pathname });
            return !v;
          });
        }}
        className="press fixed bottom-4 right-4 z-50 inline-flex h-14 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:scale-105"
        aria-label={open ? "Close assistant" : "Open assistant"}
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        <span className="hidden sm:inline">{open ? "Close" : "Ask APAC"}</span>
      </button>
    </>
  );
}

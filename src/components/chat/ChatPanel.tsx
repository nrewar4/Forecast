import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat, type Msg } from "@/context/Chat";
import { FeasibilityReport } from "@/components/cdmo/FeasibilityReport";
import { PathwaySpine } from "@/components/cdmo/PathwaySpine";
import { EnquiryForm } from "@/components/cdmo/EnquiryForm";

// Presentational view of the shared conversation. All state and generation live
// in ChatProvider (src/context/Chat.tsx), so the transcript persists across
// navigation and between the floating and embedded instances.
export function ChatPanel() {
  const { messages, quick, busy, handleSend } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, quick]);

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            msg={m}
            onContact={() => handleSend("contact", "contact")}
            onPick={(p) => handleSend(p, "feasibility")}
          />
        ))}

        {quick.length > 0 && !busy ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {quick.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => handleSend(q.value, q.intent)}
                className="press rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-card transition hover:border-primary/50 hover:text-primary"
              >
                {q.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
          setInput("");
        }}
        className="flex items-center gap-2 border-t border-border bg-background/80 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a product, CAS, or ask anything"
          className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send"
          className="press grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition hover:bg-primary-600 disabled:opacity-50"
        >
          <SendHorizonal className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function MessageBubble({
  msg,
  onContact,
  onPick,
}: {
  msg: Msg;
  onContact: () => void;
  onPick: (product: string) => void;
}) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] animate-slide-up-in rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
          {msg.text}
        </div>
      </div>
    );
  }

  const wide = msg.kind === "feasibility" || msg.kind === "pathway" || msg.kind === "enquiry";
  return (
    <div className="flex">
      <div className={cn("min-w-0", wide ? "w-full" : "max-w-[88%]")}>
        {msg.kind === "typing" ? (
          <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 160}ms` }} />
            ))}
          </div>
        ) : msg.kind === "text" ? (
          <div className="animate-slide-up-in rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2 text-sm leading-relaxed text-foreground">
            {msg.text || "…"}
          </div>
        ) : msg.kind === "feasibility" ? (
          <div className="animate-slide-up-in">
            <FeasibilityReport data={msg.data} onContact={onContact} compact />
          </div>
        ) : msg.kind === "pathway" ? (
          <div className="animate-slide-up-in">
            <PathwaySpine pathway={msg.data} onContact={onContact} compact title={msg.title} subtitle={msg.subtitle} eyebrow={msg.eyebrow} />
          </div>
        ) : msg.kind === "enquiry" ? (
          <div className="animate-slide-up-in">
            <EnquiryForm presetProduct={msg.product} context="chat" compact />
          </div>
        ) : msg.kind === "products" ? (
          <div className="animate-slide-up-in space-y-1.5">
            {msg.items.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPick(p)}
                className="press flex w-full items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-left text-sm font-medium text-foreground transition hover:border-primary/50 hover:text-primary"
              >
                {p}
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            ))}
            <Link to="/knowledge-base" className="press inline-flex items-center gap-1 pt-1 text-xs font-semibold text-primary hover:underline">
              Open Product Discovery <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

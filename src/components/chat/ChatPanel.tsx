import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, SendHorizonal, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadAiConfig, hasApiKey } from "@/lib/aiConfig";
import { streamChat, type ChatMsg } from "@/lib/openrouter";
import { track } from "@/lib/analytics";
import {
  GREETING,
  START_REPLIES,
  SITUATION_REPLIES,
  detectIntent,
  runFeasibility,
  classifySituation,
  pathwayFor,
  sampleProducts,
  type Intent,
  type QuickReply,
  type Feasibility,
} from "@/lib/chatAssistant";
import { findProduct } from "@/lib/cdmoMatch";
import type { Pathway } from "@/data/cdmoPathway";
import { FeasibilityReport } from "@/components/cdmo/FeasibilityReport";
import { PathwaySpine } from "@/components/cdmo/PathwaySpine";
import { EnquiryForm } from "@/components/cdmo/EnquiryForm";

type BotMsg =
  | { id: number; role: "bot"; kind: "text"; text: string }
  | { id: number; role: "bot"; kind: "typing" }
  | { id: number; role: "bot"; kind: "feasibility"; data: Feasibility }
  | { id: number; role: "bot"; kind: "pathway"; data: Pathway }
  | { id: number; role: "bot"; kind: "enquiry"; product?: string }
  | { id: number; role: "bot"; kind: "products"; items: string[] };
type UserMsg = { id: number; role: "user"; kind: "text"; text: string };
type Msg = BotMsg | UserMsg;

type Awaiting = "molecule" | "situation" | "chat" | null;

// Distributive Omit so each bot variant keeps its own discriminated shape
// (a plain Omit over the union would collapse to only the shared keys).
type BotPayload = BotMsg extends infer T
  ? T extends BotMsg
    ? Omit<T, "id" | "role">
    : never
  : never;

let uid = 0;
const nextId = () => ++uid;

// Tries to pull a known product out of free text so "make me some ibuprofen"
// runs the feasibility flow directly instead of asking again.
function extractProduct(text: string): string | null {
  if (findProduct(text)) return text;
  const words = text.replace(/[^a-z0-9\- ]/gi, " ").split(/\s+/).filter((w) => w.length >= 4);
  for (const w of words) if (findProduct(w)) return w;
  // Longest 2-word window
  for (let i = 0; i < words.length - 1; i++) {
    const pair = `${words[i]} ${words[i + 1]}`;
    if (findProduct(pair)) return pair;
  }
  return null;
}

export function ChatPanel({ variant = "floating" }: { variant?: "floating" | "embedded" }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [quick, setQuick] = useState<QuickReply[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const awaiting = useRef<Awaiting>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const started = useRef(false);

  // Greeting on first mount.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    setMessages([{ id: nextId(), role: "bot", kind: "text", text: GREETING }]);
    setQuick(START_REPLIES);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, quick]);

  useEffect(() => () => abortRef.current?.abort(), []);

  function pushBot(msg: BotPayload) {
    const id = nextId();
    setMessages((m) => [...m, { id, role: "bot", ...msg } as Msg]);
    return id;
  }
  function pushUser(text: string) {
    setMessages((m) => [...m, { id: nextId(), role: "user", kind: "text", text }]);
  }
  function replace(id: number, msg: BotPayload) {
    setMessages((m) => m.map((x) => (x.id === id ? ({ id, role: "bot", ...msg } as Msg) : x)));
  }

  async function doFeasibility(query: string) {
    const typingId = pushBot({ kind: "typing" });
    setBusy(true);
    const cfg = loadAiConfig();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const data = await runFeasibility(query, cfg, controller.signal);
      track("cdmo_feasibility", { product: data.match.productName, vendors: String(data.match.vendorCount) });
      replace(typingId, { kind: "feasibility", data });
      pushBot({
        kind: "text",
        text: `${data.match.vendorCount} manufacturers in our network are assessed capable of making ${data.match.productName}. Ready to take it further?`,
      });
      setQuick([
        { label: "Contact APAC", value: "contact", intent: "contact" },
        { label: "Check another product", value: "another", intent: "feasibility" },
        { label: "Plan the project", value: "plan", intent: "pathway" },
      ]);
    } catch {
      replace(typingId, {
        kind: "text",
        text: "I could not complete that lookup just now. Please try another name, or contact APAC directly and we will take it from there.",
      });
      setQuick([{ label: "Contact APAC", value: "contact", intent: "contact" }]);
    } finally {
      awaiting.current = null;
      setBusy(false);
    }
  }

  async function doPathway(text: string) {
    const typingId = pushBot({ kind: "typing" });
    setBusy(true);
    const cfg = loadAiConfig();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const archetype = await classifySituation(text, cfg, controller.signal);
      const pathway = pathwayFor(archetype);
      track("cdmo_pathway", { archetype: archetype.id });
      replace(typingId, { kind: "pathway", data: pathway });
      pushBot({ kind: "text", text: "This is how APAC would run it. Want us to scope it for your specifics?" });
      setQuick([
        { label: "Contact APAC", value: "contact", intent: "contact" },
        { label: "Get a product made", value: "another", intent: "feasibility" },
      ]);
    } catch {
      replace(typingId, {
        kind: "text",
        text: "I could not build that pathway just now. Contact APAC and a specialist will map it with you.",
      });
      setQuick([{ label: "Contact APAC", value: "contact", intent: "contact" }]);
    } finally {
      awaiting.current = null;
      setBusy(false);
    }
  }

  async function generalReply(text: string) {
    const cfg = loadAiConfig();
    if (!hasApiKey(cfg)) {
      pushBot({
        kind: "text",
        text: "I can help two ways: work out how a product gets made and who in our network can make it, or map a CDMO development pathway for your situation. Which sounds right?",
      });
      setQuick(START_REPLIES);
      return;
    }
    const botId = pushBot({ kind: "text", text: "" });
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;
    const history: ChatMsg[] = [
      {
        role: "system",
        content:
          "You are APAC Sourcing Solutions' assistant, a chemical sourcing and CDMO company. Keep replies to 2 or 3 sentences. Always steer the customer toward one of two actions: get a product made (feasibility) or plan a CDMO project (pathway), and offer to connect them with APAC. Never use an em dash.",
      },
      { role: "user", content: text },
    ];
    let acc = "";
    try {
      await streamChat(cfg, history, (tok) => {
        acc += tok;
        replace(botId, { kind: "text", text: acc });
      }, controller.signal);
    } catch {
      if (!acc) replace(botId, { kind: "text", text: "Let me point you the right way instead. What are you trying to do?" });
    } finally {
      setBusy(false);
      setQuick(START_REPLIES);
    }
  }

  function handleSend(raw: string, intentHint?: Intent) {
    const text = raw.trim();
    if (!text || busy) return;

    // Quick-reply shortcuts that are commands, not real messages.
    if (text === "contact" || intentHint === "contact") {
      pushUser("I would like to contact APAC");
      setQuick([]);
      pushBot({ kind: "text", text: "Happy to connect you. Share a few details and we respond " });
      pushBot({ kind: "enquiry" });
      awaiting.current = null;
      return;
    }
    if (text === "another") {
      setQuick([]);
      awaiting.current = "molecule";
      pushBot({ kind: "text", text: "Sure. Which product or molecule? A name, CAS number, or SMILES works." });
      return;
    }
    if (text === "plan") {
      setQuick(SITUATION_REPLIES);
      awaiting.current = "situation";
      pushBot({ kind: "text", text: "Describe your situation in a sentence, or pick the closest below." });
      return;
    }

    pushUser(text);
    setQuick([]);

    if (awaiting.current === "molecule") {
      doFeasibility(text);
      return;
    }
    if (awaiting.current === "situation") {
      doPathway(text);
      return;
    }

    const intent = intentHint ?? detectIntent(text);
    if (intent === "feasibility") {
      const product = extractProduct(text);
      if (product) {
        doFeasibility(product);
      } else {
        awaiting.current = "molecule";
        pushBot({ kind: "text", text: "Great. Which product or molecule do you want made? A name, CAS number, or SMILES works." });
      }
    } else if (intent === "pathway") {
      awaiting.current = "situation";
      pushBot({ kind: "text", text: "I can map a development pathway. Describe your situation, or pick the closest below." });
      setQuick(SITUATION_REPLIES);
    } else if (intent === "discovery") {
      const items = sampleProducts(text);
      pushBot({ kind: "text", text: "Here are a few from our catalog. Product Discovery has the full searchable set." });
      pushBot({ kind: "products", items });
      setQuick([
        { label: "Get one made", value: "another", intent: "feasibility" },
        { label: "Contact APAC", value: "contact", intent: "contact" },
      ]);
    } else {
      // Unknown intent: if the message names a product we know, treat it as a
      // feasibility request directly so a bare "ibuprofen" just works.
      const product = extractProduct(text);
      if (product) {
        doFeasibility(product);
      } else {
        generalReply(text);
      }
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div
        ref={scrollRef}
        className={cn(
          "flex-1 space-y-3 overflow-y-auto px-4 py-4",
          variant === "embedded" ? "max-h-[560px]" : "",
        )}
      >
        {messages.map((m) => (
          <MessageBubble key={m.id} msg={m} onContact={() => handleSend("contact", "contact")} onPick={(p) => handleSend(p, "feasibility")} />
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
          placeholder="Type a product, CAS, or your situation"
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

  // Bot
  const wide = msg.kind === "feasibility" || msg.kind === "pathway" || msg.kind === "enquiry";
  return (
    <div className="flex gap-2">
      <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-primary-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className={cn("min-w-0", wide ? "w-full" : "max-w-[85%]")}>
        {msg.kind === "typing" ? (
          <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground"
                style={{ animationDelay: `${i * 160}ms` }}
              />
            ))}
          </div>
        ) : msg.kind === "text" ? (
          <div className="animate-slide-up-in rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2 text-sm text-foreground">
            {msg.text || "…"}
          </div>
        ) : msg.kind === "feasibility" ? (
          <div className="animate-slide-up-in">
            <FeasibilityReport data={msg.data} onContact={onContact} compact />
          </div>
        ) : msg.kind === "pathway" ? (
          <div className="animate-slide-up-in">
            <PathwaySpine pathway={msg.data} onContact={onContact} compact />
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
            <Link
              to="/knowledge-base"
              className="press inline-flex items-center gap-1 pt-1 text-xs font-semibold text-primary hover:underline"
            >
              Open Product Discovery <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { loadAiConfig } from "@/lib/aiConfig";
import { streamChat, type ChatMsg } from "@/lib/openrouter";
import { rateLimit, LIMITS, retryHint } from "@/lib/rateLimit";
import { sanitizeText } from "@/lib/sanitize";
import { track } from "@/lib/analytics";
import {
  GREETING,
  START_REPLIES,
  SITUATION_REPLIES,
  understand,
  runFeasibility,
  classifySituation,
  pathwayFor,
  milestonesForProduct,
  timelineBasis,
  sampleProducts,
  looksLikeProductQuery,
  extractProductPhrase,
  type Intent,
  type QuickReply,
  type Feasibility,
  type TimelineBasis,
} from "@/lib/chatAssistant";
import type { CdmoMatch } from "@/lib/cdmoMatch";
import type { Pathway, Urgency } from "@/data/cdmoPathway";
import { URGENCY_META } from "@/data/cdmoPathway";

// The chat conversation lives here, at the app root, so it persists across page
// navigation and while switching between the floating widget and the embedded
// assistant. Generation runs from the provider (which never unmounts), so
// answers keep streaming even when the panel is closed or the route changes.
// The transcript is mirrored to sessionStorage so a reload keeps the history.

export type PathwayMsg = {
  id: number;
  role: "bot";
  kind: "pathway";
  data: Pathway;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
};
export type BotMsg =
  | { id: number; role: "bot"; kind: "text"; text: string }
  | { id: number; role: "bot"; kind: "typing" }
  | { id: number; role: "bot"; kind: "feasibility"; data: Feasibility }
  | PathwayMsg
  | { id: number; role: "bot"; kind: "enquiry"; product?: string }
  | { id: number; role: "bot"; kind: "products"; items: string[] };
export type UserMsg = { id: number; role: "user"; kind: "text"; text: string };
export type Msg = BotMsg | UserMsg;

type Awaiting = "molecule" | "situation" | null;
type BotPayload = BotMsg extends infer T ? (T extends BotMsg ? Omit<T, "id" | "role"> : never) : never;

const TIMELINE_REPLIES: QuickReply[] = [
  { label: "Fast", value: "urgency:fast" },
  { label: "Balanced", value: "urgency:balanced" },
  { label: "Certainty", value: "urgency:certainty" },
];

const STORE_KEY = "apac.chat.v1";

type Persisted = {
  messages: Msg[];
  quick: QuickReply[];
  awaiting: Awaiting;
  lastMatch: CdmoMatch | null;
  lastBasis: TimelineBasis | null;
  started: boolean;
};

function restore(): Persisted {
  const empty: Persisted = { messages: [], quick: [], awaiting: null, lastMatch: null, lastBasis: null, started: false };
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    if (!raw) return empty;
    const p = JSON.parse(raw) as Persisted;
    // Drop transient in-progress messages so the restored view is clean.
    const messages = (p.messages ?? []).filter((m) => m.kind !== "typing" && !(m.kind === "text" && !m.text));
    return { messages, quick: p.quick ?? [], awaiting: p.awaiting ?? null, lastMatch: p.lastMatch ?? null, lastBasis: p.lastBasis ?? null, started: Boolean(p.started) };
  } catch {
    return empty;
  }
}

let uid = 0;

type ChatValue = {
  messages: Msg[];
  quick: QuickReply[];
  busy: boolean;
  handleSend: (raw: string, intentHint?: Intent) => void;
};

const ChatContext = createContext<ChatValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const initial = useRef<Persisted>(restore());
  const [messages, setMessages] = useState<Msg[]>(initial.current.messages);
  const [quick, setQuick] = useState<QuickReply[]>(initial.current.quick);
  const [busy, setBusy] = useState(false);
  const awaiting = useRef<Awaiting>(initial.current.awaiting);
  const lastMatch = useRef<CdmoMatch | null>(initial.current.lastMatch);
  const lastBasis = useRef<TimelineBasis | null>(initial.current.lastBasis);
  const started = useRef(initial.current.started);
  const abortRef = useRef<AbortController | null>(null);

  // Continue ids past any restored history.
  useEffect(() => {
    uid = Math.max(0, ...messages.map((m) => m.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextId = () => ++uid;

  // Greeting, once per session.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    setMessages([{ id: nextId(), role: "bot", kind: "text", text: GREETING }]);
    setQuick(START_REPLIES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the transcript (without the transient typing bubble) on every change.
  useEffect(() => {
    try {
      const clean = messages.filter((m) => m.kind !== "typing");
      const payload: Persisted = { messages: clean, quick, awaiting: awaiting.current, lastMatch: lastMatch.current, lastBasis: lastBasis.current, started: started.current };
      sessionStorage.setItem(STORE_KEY, JSON.stringify(payload));
    } catch {
      // storage full or unavailable; the in-memory conversation still works
    }
  }, [messages, quick, busy]);

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
  function freshController() {
    abortRef.current?.abort();
    const c = new AbortController();
    abortRef.current = c;
    return c;
  }

  async function doFeasibility(query: string) {
    const typingId = pushBot({ kind: "typing" });
    setBusy(true);
    const cfg = loadAiConfig();
    const controller = freshController();
    try {
      const data = await runFeasibility(query, cfg, controller.signal);
      if (!data.match.known && !data.identity) {
        replace(typingId, {
          kind: "text",
          text: `I searched PubChem, the NCI CACTUS resolver and OPSIN and could not resolve "${query.trim()}" to a specific molecule. Check the spelling, or give me its CAS number or another name and I will assess it.`,
        });
        awaiting.current = "molecule";
        setQuick([{ label: "Plan a CDMO project", value: "plan", intent: "pathway" }, { label: "Contact APAC", value: "contact", intent: "contact" }]);
        return;
      }
      awaiting.current = null;
      lastMatch.current = data.match;
      lastBasis.current = timelineBasis(data);
      track("cdmo_feasibility", { product: data.match.productName, vendors: String(data.match.vendorCount) });
      replace(typingId, { kind: "feasibility", data });
      pushBot({
        kind: "text",
        text: data.chemistries.length
          ? `Making ${data.match.productName} needs ${data.chemistries.join(", ").toLowerCase()}. ${data.match.vendorCount} manufacturers in our network run that chemistry. How should we run the project? Choose your priority and I will project the milestones.`
          : `${data.match.vendorCount} manufacturers in our network can make ${data.match.productName}. How should we run the project? Choose your priority and I will project the milestones.`,
      });
      // The feasibility card already carries the single "Discuss this with APAC"
      // button, so the quick replies here stay focused on the timeline choice.
      setQuick([...TIMELINE_REPLIES]);
    } catch {
      awaiting.current = null;
      replace(typingId, {
        kind: "text",
        text: "I could not complete that lookup just now. Please try another name, or contact APAC and we will take it from there.",
      });
      setQuick([{ label: "Contact APAC", value: "contact", intent: "contact" }]);
    } finally {
      setBusy(false);
    }
  }

  function showMilestones(urgency: Urgency) {
    const match = lastMatch.current;
    const basis = lastBasis.current;
    if (!match || !basis) {
      awaiting.current = "molecule";
      pushBot({ kind: "text", text: "Which product should I project milestones for?" });
      return;
    }
    const pathway = milestonesForProduct(basis, urgency);
    track("cdmo_pathway", { product: match.productName, urgency });
    pushBot({
      kind: "pathway",
      data: pathway,
      eyebrow: `${URGENCY_META[urgency].label} track`,
      title: `Milestone projection for ${match.productName}`,
      subtitle: URGENCY_META[urgency].note,
    });
    pushBot({ kind: "text", text: "Want APAC to scope this against your real volumes and timeline?" });
    // The pathway spine already shows the single "Get this scoped by APAC" button.
    setQuick([
      { label: "Try another priority", value: "adjust" },
      { label: "Check another product", value: "another", intent: "feasibility" },
    ]);
  }

  async function doPathway(text: string) {
    const typingId = pushBot({ kind: "typing" });
    setBusy(true);
    const cfg = loadAiConfig();
    const controller = freshController();
    try {
      const archetype = await classifySituation(text, cfg, controller.signal);
      const pathway = pathwayFor(archetype);
      track("cdmo_pathway", { archetype: archetype.id });
      replace(typingId, { kind: "pathway", data: pathway });
      pushBot({ kind: "text", text: "This is how APAC would run it. Want us to scope it for your specifics?" });
      // The pathway spine already shows the single "Get this scoped by APAC" button.
      setQuick([{ label: "Get a product made", value: "another", intent: "feasibility" }]);
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
    const botId = pushBot({ kind: "text", text: "" });
    setBusy(true);
    const controller = freshController();
    const history: ChatMsg[] = [
      {
        role: "system",
        content:
          "You are APAC Sourcing Solutions' assistant, a chemical sourcing and CDMO company. Answer the user's question helpfully in 2 to 4 sentences, then, when it fits, offer to either assess how a specific product gets made and who can make it, or map a CDMO development pathway. Be concrete and factual. Never use an em dash.",
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
      if (!acc)
        replace(botId, {
          kind: "text",
          text: "I can help two ways: work out how a product gets made and who in our network can make it, or map a CDMO development pathway. Which would you like?",
        });
    } finally {
      setBusy(false);
      setQuick(START_REPLIES);
    }
  }

  function handleCommand(text: string): boolean {
    if (text === "contact") {
      pushUser("I would like to contact APAC");
      setQuick([]);
      pushBot({ kind: "text", text: "Happy to connect you. Share a few details and we respond within one business day." });
      pushBot({ kind: "enquiry", product: lastMatch.current?.productName });
      awaiting.current = null;
      return true;
    }
    if (text === "another") {
      setQuick([]);
      awaiting.current = "molecule";
      pushBot({ kind: "text", text: "Sure. Which product or molecule? A name or CAS number works." });
      return true;
    }
    if (text === "plan") {
      setQuick(SITUATION_REPLIES);
      awaiting.current = "situation";
      pushBot({ kind: "text", text: "Describe your situation in a sentence, or pick the closest below." });
      return true;
    }
    if (text === "adjust") {
      setQuick(TIMELINE_REPLIES);
      pushBot({ kind: "text", text: "Pick a different priority and I will reproject the milestones." });
      return true;
    }
    if (text.startsWith("urgency:")) {
      const u = text.slice("urgency:".length) as Urgency;
      pushUser(`${URGENCY_META[u]?.label ?? u} track`);
      setQuick([]);
      showMilestones(u);
      return true;
    }
    return false;
  }

  async function handleSend(raw: string, intentHint?: Intent) {
    // Sanitise (strip control chars, cap length) and rate-limit at the boundary,
    // so a runaway loop or an abusive script in the page cannot flood the public
    // APIs or the OpenRouter budget. Real DDoS protection is edge-level; see
    // SECURITY.md. Quick-reply commands (contact, urgency, ...) are exempt.
    const text = sanitizeText(raw, 500);
    if (!text || busy) return;

    if (handleCommand(text)) return;

    const gate = rateLimit("chat", LIMITS.chat);
    if (!gate.ok) {
      pushUser(text);
      pushBot({ kind: "text", text: `You are sending messages very quickly. Please wait ${retryHint(gate.retryAfterMs)} and try again.` });
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

    if (intentHint) {
      route(intentHint, text);
      return;
    }
    const cfg = loadAiConfig();
    const typingId = pushBot({ kind: "typing" });
    setBusy(true);
    const controller = freshController();
    try {
      const u = await understand(text, cfg, controller.signal);
      setMessages((m) => m.filter((x) => x.id !== typingId));
      setBusy(false);
      if (u.intent === "feasibility" && u.product) {
        doFeasibility(u.product);
      } else if (u.intent === "feasibility") {
        awaiting.current = "molecule";
        pushBot({ kind: "text", text: "Which product or molecule do you want made? A name or CAS number works." });
      } else if (u.intent === "pathway") {
        doPathway(u.situation || text);
      } else if (u.intent === "contact") {
        handleCommand("contact");
      } else if (u.intent === "discovery") {
        route("discovery", text);
      } else {
        generalReply(text);
      }
    } catch {
      setMessages((m) => m.filter((x) => x.id !== typingId));
      setBusy(false);
      generalReply(text);
    }
  }

  function route(intent: Intent, text: string) {
    if (intent === "feasibility") {
      const product = extractProductPhrase(text) ?? (looksLikeProductQuery(text) ? text.trim() : null);
      if (product) {
        doFeasibility(product);
      } else {
        awaiting.current = "molecule";
        pushBot({ kind: "text", text: 'Which product or molecule do you want made? Give me a name (for example "ibuprofen") or a CAS number.' });
      }
    } else if (intent === "pathway") {
      awaiting.current = "situation";
      pushBot({ kind: "text", text: "I can map a development pathway. Describe your situation, or pick the closest below." });
      setQuick(SITUATION_REPLIES);
    } else if (intent === "contact") {
      handleCommand("contact");
    } else if (intent === "discovery") {
      const items = sampleProducts(text);
      pushBot({ kind: "text", text: "Here are a few from our catalog. Product Discovery has the full searchable set." });
      pushBot({ kind: "products", items });
      setQuick([
        { label: "Get one made", value: "another", intent: "feasibility" },
        { label: "Contact APAC", value: "contact", intent: "contact" },
      ]);
    } else {
      generalReply(text);
    }
  }

  return (
    <ChatContext.Provider value={{ messages, quick, busy, handleSend }}>{children}</ChatContext.Provider>
  );
}

export function useChat(): ChatValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}

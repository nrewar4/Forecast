import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { PathwaySpine } from "@/components/cdmo/PathwaySpine";
import { FeasibilityReport } from "@/components/cdmo/FeasibilityReport";
import { EnquiryForm } from "@/components/cdmo/EnquiryForm";
import {
  GREETING,
  QUICK_REPLIES,
  REFINE_SEQUENCE,
  buildFeasibility,
  classifySituation,
  detectPath,
  extractMolecule,
  matchRefineAnswer,
  pathwayCommentary,
  type Feasibility,
} from "@/lib/chatAssistant";
import {
  tailorPathway,
  type Archetype,
  type PathwayRefinements,
  type Pathway,
} from "@/data/cdmoPathway";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Msg =
  | { id: number; role: "assistant" | "user"; kind: "text"; text: string }
  | { id: number; role: "assistant"; kind: "pathway"; pathway: Pathway }
  | { id: number; role: "assistant"; kind: "feasibility"; data: Feasibility }
  | { id: number; role: "assistant"; kind: "enquiry"; context: string };

type NoId<T> = T extends unknown ? Omit<T, "id"> : never;

// The conversation flow. Refine walks the three questions; awaitProduct asks
// which molecule a pathway is for; awaitMolecule waits for a Path B input.
type Flow =
  | { kind: "idle" }
  | { kind: "awaitMolecule" }
  | { kind: "awaitProduct"; archetype: Archetype; situation: string }
  | { kind: "refine"; step: number; archetype: Archetype; situation: string; product: string; answers: Partial<PathwayRefinements> };

type Chip = { label: string; onClick: () => void };

let counter = 0;
const nextId = () => ++counter;

export function ChatPanel({ embedded = false }: { embedded?: boolean }) {
  const [messages, setMessages] = useState<Msg[]>([
    { id: nextId(), role: "assistant", kind: "text", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [flow, setFlow] = useState<Flow>({ kind: "idle" });
  const [chips, setChips] = useState<Chip[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy, chips]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const push = (m: NoId<Msg>) => setMessages((cur) => [...cur, { ...m, id: nextId() } as Msg]);
  const say = (text: string) => push({ role: "assistant", kind: "text", text });

  // Initial quick replies.
  useEffect(() => {
    setChips(
      QUICK_REPLIES.map((q) => ({
        label: q.label,
        onClick: () => (q.path === "A" && q.seed ? startPathA(q.seed) : startPathB(undefined)),
      })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Path A: refine questions ----
  function startPathA(situation: string, product?: string) {
    setChips([]);
    const archetype = classifySituation(situation);
    if (product) {
      beginRefine(archetype, situation, product);
    } else {
      say(`Good, let me map the "${archetype.title}" path. First, which product or molecule is this for?`);
      setFlow({ kind: "awaitProduct", archetype, situation });
      setChips([{ label: "Keep it general", onClick: () => beginRefine(archetype, situation, "") }]);
    }
  }

  function beginRefine(archetype: Archetype, situation: string, product: string) {
    setFlow({ kind: "refine", step: 0, archetype, situation, product, answers: {} });
    askRefine(0);
  }

  function askRefine(step: number) {
    const q = REFINE_SEQUENCE[step];
    say(q.question);
    setChips(
      q.options.map((o) => ({
        label: o.label,
        onClick: () => answerRefine(o.label, o.value),
      })),
    );
  }

  function answerRefine(label: string, value: string) {
    setFlow((f) => {
      if (f.kind !== "refine") return f;
      push({ id: nextId(), role: "user", kind: "text", text: label } as Msg);
      const q = REFINE_SEQUENCE[f.step];
      const answers = { ...f.answers, [q.key]: value } as Partial<PathwayRefinements>;
      const nextStep = f.step + 1;
      if (nextStep < REFINE_SEQUENCE.length) {
        setChips([]);
        setTimeout(() => askRefine(nextStep), 60);
        return { ...f, step: nextStep, answers };
      }
      // All answered: confirm and build.
      setChips([]);
      setTimeout(() => finishPathway(f.archetype, f.situation, f.product, answers as PathwayRefinements), 60);
      return { ...f, step: nextStep, answers };
    });
  }

  async function finishPathway(archetype: Archetype, situation: string, product: string, refinements: PathwayRefinements) {
    setFlow({ kind: "idle" });
    const pathway = tailorPathway(archetype, refinements, product || undefined);
    say(
      `Here is a ${pathway.weeks[0]} to ${pathway.weeks[1]} week pathway${product ? ` for ${product}` : ""}, ${refinements.speed === "fast" ? "compressed for speed" : refinements.speed === "certain" ? "extended for certainty" : "balanced"}.`,
    );
    push({ role: "assistant", kind: "pathway", pathway });
    track("cdmo_pathway", { archetype: archetype.id, start: refinements.start, goal: refinements.goal, speed: refinements.speed });

    // Optional streamed, product-specific commentary.
    const noteId = nextId();
    let streamed = "";
    setMessages((cur) => [...cur, { id: noteId, role: "assistant", kind: "text", text: "" } as Msg]);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setBusy(true);
    try {
      await pathwayCommentary(pathway, situation, (tok) => {
        streamed += tok;
        setMessages((cur) => cur.map((m) => (m.id === noteId && m.kind === "text" ? { ...m, text: streamed } : m)));
      }, controller.signal);
    } finally {
      setBusy(false);
    }
    // Drop the note if nothing streamed (no key), then invite an enquiry.
    setMessages((cur) => cur.filter((m) => !(m.id === noteId && m.kind === "text" && !streamed.trim())));
    say("Want this scoped and costed for your volumes? Share a few details and our team will come back with a plan.");
    push({ role: "assistant", kind: "enquiry", context: `Pathway: ${archetype.title}${product ? ` for ${product}` : ""}. ${situation}` });
  }

  // ---- Path B: feasibility for any molecule ----
  function startPathB(seed?: string) {
    setChips([]);
    if (seed && extractMolecule(seed)) {
      runFeasibility(extractMolecule(seed));
    } else {
      say("Which molecule should I check? A drug name, CAS number, or SMILES all work.");
      setFlow({ kind: "awaitMolecule" });
    }
  }

  async function runFeasibility(molecule: string) {
    setFlow({ kind: "idle" });
    const loadingId = nextId();
    setMessages((cur) => [...cur, { id: loadingId, role: "assistant", kind: "text", text: `Checking PubChem and scoping the chemistry for ${molecule}...` }]);
    setBusy(true);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const data = await buildFeasibility(molecule, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setMessages((cur) => cur.filter((m) => m.id !== loadingId));
      push({ role: "assistant", kind: "feasibility", data });
      track("cdmo_feasibility", { molecule: data.resolvedName, inCatalog: String(data.vendor.inCatalog), resolved: String(!!data.identity) });
      // Offer the pathway follow-up, carrying the product across.
      say(`Want a CDMO pathway to make ${data.resolvedName}? I can map the timeline and milestones.`);
      setChips([
        { label: `Map a pathway for ${truncate(data.resolvedName)}`, onClick: () => startPathA("get this molecule made", data.resolvedName) },
        { label: "Check another molecule", onClick: () => startPathB(undefined) },
      ]);
    } catch {
      setMessages((cur) => cur.filter((m) => m.id !== loadingId));
      say("I could not complete that lookup just now. Please try again, or send it to our team and a chemist will confirm.");
      push({ role: "assistant", kind: "enquiry", context: `Feasibility request: ${molecule}` });
    } finally {
      if (abortRef.current === controller) setBusy(false);
    }
  }

  // ---- Router ----
  function handle(text: string) {
    const clean = text.trim();
    if (!clean || busy) return;
    push({ role: "user", kind: "text", text: clean });
    setInput("");
    setChips([]);

    if (flow.kind === "awaitMolecule") {
      const mol = extractMolecule(clean);
      if (mol) runFeasibility(mol);
      else say("I did not catch a molecule there. Try a drug name, CAS number, or SMILES.");
      return;
    }
    if (flow.kind === "awaitProduct") {
      const skip = /^(skip|general|none|no)\b/i.test(clean);
      beginRefine(flow.archetype, flow.situation, skip ? "" : clean);
      return;
    }
    if (flow.kind === "refine") {
      const q = REFINE_SEQUENCE[flow.step];
      answerRefine(clean, matchRefineAnswer(q, clean));
      return;
    }

    track("chat_intent", { path: detectPath(clean) });
    if (detectPath(clean) === "A") startPathA(clean);
    else startPathB(clean);
  }

  const startEnquiry = (context: string) => push({ role: "assistant", kind: "enquiry", context });

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => {
          if (m.kind === "text") {
            if (!m.text) return null;
            return (
              <div key={m.id} className={cn("slide-down flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                    m.role === "user" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground",
                  )}
                >
                  {m.text}
                </div>
              </div>
            );
          }
          if (m.kind === "pathway") {
            return (
              <div key={m.id} className="slide-down rounded-2xl border border-border bg-card p-4">
                <PathwaySpine pathway={m.pathway} />
              </div>
            );
          }
          if (m.kind === "feasibility") {
            return (
              <div key={m.id} className="slide-down">
                <FeasibilityReport data={m.data} onEnquire={() => startEnquiry(`Feasibility enquiry: ${m.data.resolvedName}`)} />
              </div>
            );
          }
          return (
            <div key={m.id} className="slide-down rounded-2xl border border-border bg-card p-4">
              <EnquiryForm context={m.context} compact={!embedded} />
            </div>
          );
        })}

        {busy ? (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
            </div>
          </div>
        ) : null}

        {chips.length ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {chips.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={c.onClick}
                className="press rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                {c.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handle(input); }} className="flex items-center gap-2 border-t border-border p-3">
        <div className="relative flex-1">
          <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              flow.kind === "awaitMolecule" ? "Name a drug or CAS number..."
              : flow.kind === "refine" ? "Type your answer or pick above..."
              : "Describe your situation or name a molecule..."
            }
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="press grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary-600 disabled:opacity-50"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function truncate(s: string, n = 22): string {
  return s.length > n ? s.slice(0, n - 1) + "..." : s;
}

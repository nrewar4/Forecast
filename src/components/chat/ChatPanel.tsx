import { useEffect, useMemo, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { PathwaySpine } from "@/components/cdmo/PathwaySpine";
import { FeasibilityReport } from "@/components/cdmo/FeasibilityReport";
import { EnquiryForm } from "@/components/cdmo/EnquiryForm";
import {
  GREETING,
  QUICK_REPLIES,
  buildFeasibility,
  classifySituation,
  detectPath,
  extractMolecule,
  type Feasibility,
} from "@/lib/chatAssistant";
import { buildPathway, type Pathway } from "@/data/cdmoPathway";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Msg =
  | { id: number; role: "assistant" | "user"; kind: "text"; text: string }
  | { id: number; role: "assistant"; kind: "pathway"; pathway: Pathway }
  | { id: number; role: "assistant"; kind: "feasibility"; data: Feasibility }
  | { id: number; role: "assistant"; kind: "enquiry"; context: string };

// Distributive Omit so each union member keeps its own extra fields.
type NoId<T> = T extends unknown ? Omit<T, "id"> : never;

let counter = 0;
const nextId = () => ++counter;

export function ChatPanel({ embedded = false }: { embedded?: boolean }) {
  const [messages, setMessages] = useState<Msg[]>([
    { id: nextId(), role: "assistant", kind: "text", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [awaitingMolecule, setAwaitingMolecule] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const push = (m: NoId<Msg>) => setMessages((cur) => [...cur, { ...m, id: nextId() } as Msg]);

  async function handle(text: string, forced?: { path: "A" | "B" }) {
    const clean = text.trim();
    if (!clean || busy) return;
    setShowChips(false);
    push({ role: "user", kind: "text", text: clean });
    setInput("");

    const path = awaitingMolecule ? "B" : forced?.path ?? detectPath(clean);
    setAwaitingMolecule(false);
    track("chat_intent", { path });

    if (path === "A") {
      const archetype = classifySituation(clean);
      const pathway = buildPathway(archetype);
      push({ role: "assistant", kind: "text", text: `Here is how APAC would approach that. This is the "${archetype.title}" path.` });
      push({ role: "assistant", kind: "pathway", pathway });
      push({ role: "assistant", kind: "text", text: "Want this scoped for your molecule and volumes? Share a few details and our team will come back with a plan." });
      push({ role: "assistant", kind: "enquiry", context: `Pathway interest: ${archetype.title}. ${clean}` });
      track("cdmo_pathway", { archetype: archetype.id });
      return;
    }

    // Path B: feasibility.
    const molecule = extractMolecule(clean);
    if (!molecule) {
      push({ role: "assistant", kind: "text", text: "Which molecule should I check? A name, CAS number, or SMILES all work." });
      setAwaitingMolecule(true);
      return;
    }

    const loadingId = nextId();
    setMessages((cur) => [...cur, { id: loadingId, role: "assistant", kind: "text", text: `Checking PubChem and the APAC catalog for ${molecule}...` }]);
    setBusy(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      let streamed = "";
      const data = await buildFeasibility(molecule, {
        signal: controller.signal,
        onAiToken: (tok) => {
          streamed += tok;
          setMessages((cur) =>
            cur.map((m) => (m.id === loadingId && m.kind === "text" ? { ...m, text: `Scoping ${molecule}...\n\n${streamed}` } : m)),
          );
        },
      });
      if (controller.signal.aborted) return;
      // Replace the loading line with the structured report.
      setMessages((cur) => cur.filter((m) => m.id !== loadingId));
      push({ role: "assistant", kind: "feasibility", data });
      track("cdmo_feasibility", { molecule: data.resolvedName, inCatalog: String(data.vendor.inCatalog), resolved: String(!!data.identity) });
    } catch {
      setMessages((cur) => cur.filter((m) => m.id !== loadingId));
      push({ role: "assistant", kind: "text", text: "I could not complete that lookup just now. Please try again, or send it to our team and a chemist will confirm." });
      push({ role: "assistant", kind: "enquiry", context: `Feasibility request: ${molecule}` });
    } finally {
      if (abortRef.current === controller) setBusy(false);
    }
  }

  const startEnquiry = (context: string) => push({ role: "assistant", kind: "enquiry", context });

  const chips = useMemo(() => QUICK_REPLIES, []);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Messages */}
      <div ref={scrollRef} className={cn("flex-1 space-y-3 overflow-y-auto p-4", embedded ? "" : "")}>
        {messages.map((m) => {
          if (m.kind === "text") {
            return (
              <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-foreground",
                  )}
                >
                  {m.text}
                </div>
              </div>
            );
          }
          if (m.kind === "pathway") {
            return (
              <div key={m.id} className="rounded-2xl border border-border bg-card p-4">
                <PathwaySpine pathway={m.pathway} />
              </div>
            );
          }
          if (m.kind === "feasibility") {
            return (
              <div key={m.id}>
                <FeasibilityReport data={m.data} onEnquire={() => startEnquiry(`Feasibility enquiry: ${m.data.resolvedName}`)} />
              </div>
            );
          }
          // enquiry
          return (
            <div key={m.id} className="rounded-2xl border border-border bg-card p-4">
              <EnquiryForm context={m.context} compact={!embedded} />
            </div>
          );
        })}

        {/* Quick replies */}
        {showChips ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {chips.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => (c.seed ? handle(c.seed, { path: c.path }) : (setAwaitingMolecule(true), setShowChips(false), push({ role: "assistant", kind: "text", text: "Which molecule should I check? A name, CAS number, or SMILES all work." })))}
                className="press rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                {c.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => { e.preventDefault(); handle(input); }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <div className="relative flex-1">
          <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={awaitingMolecule ? "Name a molecule or CAS number..." : "Describe your situation or name a molecule..."}
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

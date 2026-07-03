import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Building2, Factory, IndianRupee, Search } from "lucide-react";
import { Sidebar, type SidebarNav } from "./Sidebar";
import { products } from "@/data/products";
import { clients } from "@/data/clients";
import { supplierGroups } from "@/data/suppliers";
import { matchesCas } from "@/lib/cas";
import { useCurrency } from "@/context/Currency";

type Result = {
  kind: "Product" | "Buyer" | "Manufacturer";
  label: string;
  hint: string;
  to: string;
};

const allSuppliers = supplierGroups.flatMap((g) =>
  g.suppliers.map((s) => ({ ...s, group: g.product })),
);

function buildResults(query: string): Result[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const qCas = q.replace(/\s+/g, "");

  const productHits: Result[] = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.hsCode.includes(q) ||
        p.cas.replace(/\s+/g, "").includes(qCas),
    )
    .map((p) => ({
      kind: "Product",
      label: p.name,
      hint: `CAS ${p.cas} · HS ${p.hsCode}`,
      to: `/knowledge-base?q=${encodeURIComponent(p.name)}`,
    }));

  const buyerHits: Result[] = clients
    .filter(
      (c) =>
        c.company.toLowerCase().includes(q) ||
        c.primaryProducts.some((p) => p.toLowerCase().includes(q)) ||
        c.hsCodes.some((h) => h.includes(q)) ||
        matchesCas(q, c.hsCodes, c.primaryProducts),
    )
    .map((c) => ({
      kind: "Buyer",
      label: c.company,
      hint: c.sector,
      to: `/partners?q=${encodeURIComponent(c.company)}`,
    }));

  const supplierHits: Result[] = allSuppliers
    .filter(
      (s) =>
        s.company.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.group.toLowerCase().includes(q) ||
        matchesCas(q, [], [s.group]),
    )
    .map((s) => ({
      kind: "Manufacturer",
      label: s.company,
      hint: s.country,
      to: `/partners?q=${encodeURIComponent(s.company)}`,
    }));

  return [...productHits, ...buyerHits, ...supplierHits].slice(0, 8);
}

const kindIcon = {
  Product: Box,
  Buyer: Building2,
  Manufacturer: Factory,
} as const;

function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => buildResults(query), [query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function go(r: Result) {
    navigate(r.to);
    setQuery("");
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className="relative hidden max-w-md flex-1 md:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search HS codes, CAS no., products, companies"
        className="h-9 w-full rounded-md border border-border bg-muted/50 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
      />
      {open && query.trim() ? (
        <div className="absolute left-0 right-0 top-11 z-20 overflow-hidden rounded-md border border-border bg-background shadow-card">
          {results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-muted-foreground">
              No matches for "{query.trim()}"
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((r, i) => {
                const Icon = kindIcon[r.kind];
                return (
                  <li key={r.kind + r.label}>
                    <button
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(r)}
                      className={
                        "flex w-full items-center gap-3 px-3 py-2 text-left transition " +
                        (i === active ? "bg-muted" : "hover:bg-muted/60")
                      }
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {r.label}
                        </span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {r.hint}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {r.kind}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

// Switches every monetary figure in the app between USD and INR. The trade data
// is stored in USD, so this only changes how amounts are displayed.
function CurrencyToggle() {
  const { currency, toggle } = useCurrency();
  return (
    <button
      type="button"
      onClick={toggle}
      title={`Showing ${currency}. Click to switch to ${currency === "USD" ? "INR" : "USD"}.`}
      className="press inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
    >
      <IndianRupee className="h-3.5 w-3.5 text-primary" />
      <span className={currency === "USD" ? "text-primary" : "text-muted-foreground"}>USD</span>
      <span className="text-border">/</span>
      <span className={currency === "INR" ? "text-primary" : "text-muted-foreground"}>INR</span>
    </button>
  );
}

export function AppShell({
  title,
  subtitle,
  nav,
  children,
}: {
  title: string;
  subtitle?: string;
  nav?: SidebarNav;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Sidebar nav={nav} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur md:px-8">
          <GlobalSearch />
          <div className="ml-auto flex items-center gap-3">
            <CurrencyToggle />
            <div className="press flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                AS
              </div>
              <div className="hidden text-left md:block">
                <div className="text-xs font-semibold leading-tight">
                  APAC Sourcing
                </div>
                <div className="text-[11px] leading-tight text-muted-foreground">
                  Analyst
                </div>
              </div>
            </div>
          </div>
        </header>
        <main id="main-content" className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mb-6 animate-fade-up">
            <h1 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Database, Download, FileSpreadsheet, FileText, Plus, RotateCcw, Trash2, UploadCloud } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { KpiChip } from "@/components/Kpi";
import { cn, num } from "@/lib/utils";
import { useTradeData } from "@/context/TradeData";
import { downloadTemplate, parseTradeFile } from "@/lib/parseTrade";
import { indicativePerTonne } from "@/lib/assumedPricing";
import { products } from "@/data/products";
import type { Mode } from "@/data/trade";

const productByHs = new Map(products.map((p) => [p.hsCode, p.name]));

type Doc = {
  file: string;
  type: "Excel" | "PDF" | "Other";
  uploaded: string;
  status: "Parsed" | "In review" | "Rejected";
  rows?: number;
  note?: string;
};

// Real Datamyne extracts that were parsed into the seed trade database.
const seed: Doc[] = [
  { file: "Datamyne_6_18_2026_10_56.xlsx", type: "Excel", uploaded: "2026-06-18", status: "Parsed", rows: 5000 },
  { file: "Datamyne_6_18_2026_11_2.xlsx", type: "Excel", uploaded: "2026-06-18", status: "Parsed", rows: 5000 },
  { file: "Datamyne_6_18_2026_15_0.xlsx", type: "Excel", uploaded: "2026-06-18", status: "Parsed", rows: 5000 },
  { file: "Datamyne_6_18_2026_16_33.xlsx", type: "Excel", uploaded: "2026-06-18", status: "Parsed", rows: 5000 },
  { file: "Datamyne_6_18_2026_11_14_export.xlsx", type: "Excel", uploaded: "2026-06-18", status: "Parsed", rows: 5000 },
  { file: "Datamyne_6_19_2026_10_16.xlsx", type: "Excel", uploaded: "2026-06-19", status: "Parsed", rows: 5000 },
  { file: "Datamyne_6_19_2026_10_18.xlsx", type: "Excel", uploaded: "2026-06-19", status: "Parsed", rows: 5000 },
  { file: "Datamyne_6_19_2026_10_19.xlsx", type: "Excel", uploaded: "2026-06-19", status: "Parsed", rows: 5000 },
  { file: "Datamyne_6_19_2026_10_21.xlsx", type: "Excel", uploaded: "2026-06-19", status: "Parsed", rows: 5000 },
];

function classify(name: string): Doc["type"] {
  const lower = name.toLowerCase();
  if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) return "Excel";
  if (lower.endsWith(".pdf")) return "PDF";
  return "Other";
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function Documents() {
  const { addShipments, resetShipments, uploadedCount, shipments, backend, assumed, setAssumed, estimatedCount } =
    useTradeData();
  const [docs, setDocs] = useState<Doc[]>(seed);
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState<Mode>("Imports");
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<{ tone: "ok" | "warn"; text: string } | null>(null);
  const [newHs, setNewHs] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const overrideEntries = Object.entries(assumed.overrides);

  function setOverride(hs: string, price: number) {
    setAssumed({ ...assumed, overrides: { ...assumed.overrides, [hs]: price } });
  }

  function removeOverride(hs: string) {
    const next = { ...assumed.overrides };
    delete next[hs];
    setAssumed({ ...assumed, overrides: next });
  }

  function addOverride() {
    const hs = newHs.trim();
    const price = Math.max(0, Number(newPrice) || 0);
    if (!hs || !price) return;
    setOverride(hs, price);
    setNewHs("");
    setNewPrice("");
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setBanner(null);
    const newDocs: Doc[] = [];
    let totalImported = 0;

    for (const file of Array.from(files)) {
      const type = classify(file.name);
      if (type !== "Excel") {
        newDocs.push({
          file: file.name,
          type,
          uploaded: today(),
          status: "In review",
          note: "Stored for manual review. Only Excel updates the trade database.",
        });
        continue;
      }
      try {
        const result = await parseTradeFile(file, mode);
        if (result.imported === 0) {
          newDocs.push({
            file: file.name,
            type,
            uploaded: today(),
            status: "Rejected",
            note:
              result.missingColumns.length > 0
                ? `Missing columns: ${result.missingColumns.join(", ")}`
                : "No rows found",
          });
        } else {
          await addShipments(result.rows);
          totalImported += result.imported;
          const notes: string[] = [`Added to ${mode}`];
          if (result.skipped) notes.push(`${result.skipped} rows skipped`);
          if (result.valueColumnMissing) notes.push("no value column, value set to 0");
          newDocs.push({
            file: file.name,
            type,
            uploaded: today(),
            status: "Parsed",
            rows: result.imported,
            note: notes.join(", "),
          });
        }
      } catch {
        newDocs.push({
          file: file.name,
          type,
          uploaded: today(),
          status: "Rejected",
          note: "Could not read the file",
        });
      }
    }

    setDocs((prev) => [...newDocs, ...prev]);
    setBusy(false);
    if (totalImported > 0) {
      const where = backend === "Supabase" ? "the shared Supabase database" : "this browser";
      setBanner({
        tone: "ok",
        text: `Imported ${num(totalImported)} ${mode.toLowerCase()} records into ${where}. They now appear in Trade Analytics.`,
      });
    } else {
      setBanner({
        tone: "warn",
        text: "No trade records were imported. Check the column headers against the template.",
      });
    }
  }

  return (
    <AppShell
      title="Documents"
      subtitle="Upload Datamyne Excel extracts to update the trade database, or store PDFs for reference."
    >
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs">
        <span
          className={cn(
            "inline-flex h-2 w-2 rounded-full",
            backend === "Supabase" ? "bg-emerald-500" : "bg-amber-500",
          )}
        />
        <span className="font-medium text-foreground">
          {backend === "Supabase" ? "Shared Supabase database connected" : "Browser storage mode"}
        </span>
        <span className="text-muted-foreground">
          {backend === "Supabase"
            ? "Uploads sync for every user."
            : "Uploads persist on this device only. Add Supabase keys to share across users."}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiChip icon={Database} label="Records in Database" value={num(shipments.length)} sub="seed plus uploads" />
        <KpiChip icon={UploadCloud} label="Uploaded Records" value={num(uploadedCount)} sub={backend === "Supabase" ? "shared" : "this browser"} />
        <KpiChip icon={FileSpreadsheet} label="Files Logged" value={String(docs.length)} sub="session" />
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Upload Trade Data</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Excel rows are parsed and appended to the {mode.toLowerCase()} database.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-border bg-background p-1">
              {(["Imports", "Exports"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium transition",
                    mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted"
            >
              <Download className="h-3.5 w-3.5" />
              Template
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={cn(
              "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition",
              dragging ? "border-primary bg-accent" : "border-border bg-muted/40",
            )}
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-primary">
              <UploadCloud className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-foreground">
              {busy ? "Parsing files..." : "Drag and drop files here"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Excel (.xlsx, .xls) updates the database. PDF is stored for review.
            </p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Working..." : "Select files"}
            </button>
          </div>

          {banner ? (
            <div
              className={cn(
                "mt-4 flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
                banner.tone === "ok"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-amber-200 bg-amber-50 text-amber-700",
              )}
            >
              {banner.tone === "ok" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              {banner.text}
            </div>
          ) : null}

          <p className="mt-3 text-xs text-muted-foreground">
            Accepted headers include Date, HS Code, Product or Commercial Description, Sector,
            Transport, Importer or Foreign Buyer, Supplier or Exporter, Origin, Quantity with a Unit
            column, Unit Value, and Total or FOB Value. Quantities in kilograms or pounds are converted
            to tonnes automatically. Raw US export manifests work too: the parser reads the Shipper,
            Country, Metric Tons, and Full Container Description columns and pulls the HS code and
            chemical name out of the free text. Download the template for the exact layout.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Assumed Pricing</CardTitle>
            <p className="mt-0.5 max-w-xl text-xs text-muted-foreground">
              Some Datamyne extracts have no value column. Turn this on to estimate value from
              quantity. Estimated rows are clearly labelled assumed across the app and never replace
              declared values.
            </p>
          </div>
          <button
            onClick={() => setAssumed({ ...assumed, enabled: !assumed.enabled })}
            role="switch"
            aria-checked={assumed.enabled}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition",
              assumed.enabled ? "bg-primary" : "bg-border",
            )}
          >
            <span
              className={cn(
                "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
                assumed.enabled ? "translate-x-5" : "translate-x-0.5",
              )}
            />
          </button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Default assumed price
              </label>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">USD</span>
                <input
                  type="number"
                  min={0}
                  value={assumed.defaultPerTonne}
                  disabled={!assumed.enabled}
                  onChange={(e) =>
                    setAssumed({ ...assumed, defaultPerTonne: Math.max(0, Number(e.target.value) || 0) })
                  }
                  className="h-9 w-28 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary disabled:opacity-50"
                />
                <span className="text-sm text-muted-foreground">per tonne</span>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              {assumed.enabled ? (
                <>
                  <span className="font-semibold text-foreground">{num(estimatedCount)}</span> rows are valued
                  using assumptions. Per HS code prices below take priority, then indicative book price, then
                  this default.
                </>
              ) : (
                <>Estimation is off. Rows without a value stay at zero.</>
              )}
            </div>
          </div>

          <div className={cn("mt-5", !assumed.enabled && "pointer-events-none opacity-50")}>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Per HS code assumed prices
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Override the assumed price for specific HS codes. These take priority over the default.
            </p>

            <div className="mt-3 overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60 text-left text-muted-foreground">
                    <th className="px-3 py-2 font-medium">HS Code</th>
                    <th className="px-3 py-2 font-medium">Product</th>
                    <th className="px-3 py-2 text-right font-medium">Assumed USD per tonne</th>
                    <th className="w-12 px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {overrideEntries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-xs text-muted-foreground">
                        No overrides yet. Add one below to fine tune a specific HS code.
                      </td>
                    </tr>
                  ) : (
                    overrideEntries.map(([hs, price]) => (
                      <tr key={hs} className="border-t border-border">
                        <td className="px-3 py-2 font-mono text-xs">{hs}</td>
                        <td className="px-3 py-2 text-muted-foreground">{productByHs.get(hs) ?? "Custom"}</td>
                        <td className="px-3 py-2 text-right">
                          <input
                            type="number"
                            min={0}
                            value={price}
                            onChange={(e) => setOverride(hs, Math.max(0, Number(e.target.value) || 0))}
                            className="h-8 w-28 rounded-md border border-border bg-background px-2 text-right text-sm outline-none focus:border-primary"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() => removeOverride(hs)}
                            aria-label={`Remove override for ${hs}`}
                            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-rose-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex flex-wrap items-end gap-2">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground">HS Code</label>
                <input
                  list="hs-suggestions"
                  value={newHs}
                  onChange={(e) => setNewHs(e.target.value)}
                  placeholder="e.g. 29071100"
                  className="mt-1 h-9 w-40 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                />
                <datalist id="hs-suggestions">
                  {products.map((p) => (
                    <option key={p.hsCode} value={p.hsCode}>
                      {p.name}
                    </option>
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground">USD per tonne</label>
                <input
                  type="number"
                  min={0}
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder={newHs && indicativePerTonne[newHs.trim()] ? String(indicativePerTonne[newHs.trim()]) : "price"}
                  className="mt-1 h-9 w-32 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <button
                onClick={addOverride}
                disabled={!newHs.trim() || !Number(newPrice)}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Recent Documents</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">{docs.length} files</p>
          </div>
          {uploadedCount > 0 ? (
            <button
              onClick={() => {
                resetShipments();
                setBanner({ tone: "warn", text: "Uploaded records cleared. Default data restored." });
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset uploads
            </button>
          ) : null}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60 text-left text-muted-foreground">
                  <th className="px-3 py-2 font-medium">File</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 text-right font-medium">Rows</th>
                  <th className="px-3 py-2 font-medium">Uploaded</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d, idx) => (
                  <tr key={d.file + idx} className="border-t border-border">
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-2 font-medium">
                        {d.type === "Excel" ? (
                          <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <FileText className="h-4 w-4 text-primary" />
                        )}
                        {d.file}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{d.type}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                      {d.rows ? num(d.rows) : "-"}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{d.uploaded}</td>
                    <td className="px-3 py-2.5">
                      <Badge
                        tone={d.status === "Parsed" ? "green" : d.status === "Rejected" ? "amber" : "gray"}
                      >
                        {d.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{d.note ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Excel parsing runs in the browser with SheetJS. Imported rows persist on this device and
            flow straight into Trade Analytics. Connect a backend later to share across users.
          </p>
        </CardContent>
      </Card>
    </AppShell>
  );
}

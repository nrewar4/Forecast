import { FileSpreadsheet, FileText, UploadCloud } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

type Doc = { file: string; type: "Excel" | "PDF"; uploaded: string; status: "Parsed" | "In review" };

const recent: Doc[] = [
  { file: "Datamyne_import_Feb2026.xlsx", type: "Excel", uploaded: "2026-06-18", status: "Parsed" },
  { file: "Supplier_COA_OCP.pdf", type: "PDF", uploaded: "2026-06-17", status: "Parsed" },
  { file: "GMP_certificate_Anthem.pdf", type: "PDF", uploaded: "2026-06-15", status: "In review" },
];

export default function Documents() {
  return (
    <AppShell
      title="Documents"
      subtitle="Upload PDF and Excel files to enrich the knowledge base and trade records."
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 px-6 py-14 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-primary">
              <UploadCloud className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-foreground">Drag and drop files here</h2>
            <p className="mt-1 text-sm text-muted-foreground">Accepted types, .pdf, .xlsx, and .xls</p>
            <button className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
              Upload files
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle>Recent Documents</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60 text-left text-muted-foreground">
                  <th className="px-3 py-2 font-medium">File</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Uploaded</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((d) => (
                  <tr key={d.file} className="border-t border-border">
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
                    <td className="px-3 py-2.5 text-muted-foreground">{d.uploaded}</td>
                    <td className="px-3 py-2.5">
                      <Badge tone={d.status === "Parsed" ? "green" : "amber"}>{d.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            PDF parsing uses pdfplumber or tabula. Excel uses a column mapping step before cleaning.
          </p>
        </CardContent>
      </Card>
    </AppShell>
  );
}

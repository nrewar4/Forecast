import { Plug } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge, Card, CardContent } from "@/components/ui";
import { integrations, type Integration } from "@/data/integrations";

export default function Integrations() {
  const categories = Array.from(new Set(integrations.map((i) => i.category)));
  const byCategory: Record<string, Integration[]> = {};
  categories.forEach((c) => {
    byCategory[c] = integrations.filter((i) => i.category === c);
  });

  return (
    <AppShell
      title="Integrations"
      subtitle="Room to add more databases as you grow. Connect trade, pricing, and compliance sources."
    >
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {cat}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {byCategory[cat].map((i) => (
                <Card key={i.name}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary">
                        <Plug className="h-4 w-4" />
                      </div>
                      <Badge tone={i.status === "Connected" ? "orange" : "gray"}>{i.status}</Badge>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-foreground">{i.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{i.purpose}</p>
                    {i.status === "Available" ? (
                      <button className="mt-4 w-full rounded-md border border-border bg-background py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted">
                        Connect
                      </button>
                    ) : (
                      <button className="mt-4 w-full rounded-md bg-accent py-1.5 text-xs font-semibold text-accent-foreground">
                        Manage
                      </button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

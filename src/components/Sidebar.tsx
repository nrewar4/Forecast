import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  BookOpen,
  Users,
  Factory,
  FileText,
  Plug,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Trade Analytics", url: "/trade-analytics", icon: BarChart3 },
  { title: "Demand Forecast", url: "/demand-forecast", icon: TrendingUp },
  { title: "Product Knowledge Base", url: "/knowledge-base", icon: BookOpen },
  { title: "Clients (Buyers)", url: "/clients", icon: Users },
  { title: "Suppliers (Manufacturers)", url: "/suppliers", icon: Factory },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Integrations", url: "/integrations", icon: Plug },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-background md:flex">
      <div className="border-b border-border px-5 py-5">
        <span className="block text-2xl font-extrabold tracking-tight text-primary">
          APAC
        </span>
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Supply Chain <span className="mx-1 text-border">|</span> CDMO
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Workspace
        </p>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.url}
                end={item.url === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground",
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

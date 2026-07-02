import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  BookOpen,
  FlaskConical,
  Handshake,
  FileText,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

const items = [
  { title: "Market Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Trade Analytics", url: "/trade-analytics", icon: BarChart3 },
  { title: "Demand Forecast", url: "/demand-forecast", icon: TrendingUp },
  { title: "Product Knowledge Base", url: "/knowledge-base", icon: BookOpen },
  { title: "Synthesis Routes", url: "/synthesis-routes", icon: FlaskConical },
  { title: "Trade Partners", url: "/partners", icon: Handshake },
  { title: "Documents", url: "/documents", icon: FileText },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-background md:flex">
      <div className="px-5 py-5">
        <Link to="/" aria-label="APAC — Supply Chain | CDMO home" className="press inline-block">
          <Logo className="h-10 w-auto" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Workspace
        </p>
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.url}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/75 hover:bg-muted hover:text-foreground",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary transition-opacity duration-200",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                      )}
                    />
                    <span>{item.title}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        <Link
          to="/"
          className="press flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to site
        </Link>
      </div>
    </aside>
  );
}

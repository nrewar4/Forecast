import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  BookOpen,
  FlaskConical,
  FileText,
  ShieldCheck,
  LogIn,
  LogOut,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { useAuth } from "@/context/Auth";

export type SidebarItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

export type SidebarNav = {
  label: string;
  items: SidebarItem[];
  backTo: { url: string; label: string };
};

// The default workspace: the public Knowledge platform. Analyst tooling (trade
// analytics, forecasting, uploads) is admin only.
export const KNOWLEDGE_NAV: SidebarNav = {
  label: "Workspace",
  items: [
    { title: "Product Discovery", url: "/knowledge-base", icon: BookOpen },
    { title: "Market Overview", url: "/dashboard", icon: LayoutDashboard },
    { title: "Trade Analytics", url: "/trade-analytics", icon: BarChart3, adminOnly: true },
    { title: "Demand Forecast", url: "/demand-forecast", icon: TrendingUp, adminOnly: true },
    { title: "Synthesis Routes", url: "/synthesis-routes", icon: FlaskConical, adminOnly: true },
    { title: "Documents", url: "/documents", icon: FileText, adminOnly: true },
  ],
  backTo: { url: "/", label: "Back to site" },
};

// Analyst tooling reuses the same workspace navigation.
export const SYNTHESIS_NAV: SidebarNav = KNOWLEDGE_NAV;

export function Sidebar({ nav = KNOWLEDGE_NAV }: { nav?: SidebarNav }) {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const items = nav.items.filter((i) => !i.adminOnly || isAdmin);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-background md:flex">
      <div className="px-5 py-5">
        <Link to="/" aria-label="APAC Supply Chain home" className="press inline-block">
          <Logo className="h-14 w-auto" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {nav.label}
        </p>
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item.title}>
              <SidebarLink item={item} />
            </li>
          ))}
        </ul>

        {isAdmin ? (
          <>
            <p className="px-3 pb-2 pt-5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Admin
            </p>
            <ul className="space-y-0.5">
              <li>
                <SidebarLink item={{ title: "Admin Dashboard", url: "/admin", icon: ShieldCheck }} />
              </li>
            </ul>
          </>
        ) : null}
      </nav>

      <div className="space-y-0.5 border-t border-border p-3">
        {isAdmin ? (
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="press flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        ) : (
          <Link
            to="/login"
            className="press flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogIn className="h-3.5 w-3.5" />
            Admin sign in
          </Link>
        )}
        <Link
          to={nav.backTo.url}
          className="press flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {nav.backTo.label}
        </Link>
      </div>
    </aside>
  );
}

function SidebarLink({ item }: { item: SidebarItem }) {
  return (
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
  );
}

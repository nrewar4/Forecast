import { Link, NavLink } from "react-router-dom";
import {
  ChevronLeft,
  FlaskConical,
  Gauge,
  Mail,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

// The custom synthesis workspace mirrors the knowledge workspace: a sidebar of
// sections on the left, content on the right. It is reached from the Custom
// Synthesis page ("Explore synthesis routes"), not from the top navigation.
const SECTIONS: { title: string; url: string; icon: LucideIcon }[] = [
  { title: "Custom Synthesis Routes", url: "/synthesis/routes", icon: FlaskConical },
  { title: "Process Development", url: "/synthesis/process", icon: Workflow },
  { title: "Scale-up & Manufacturing", url: "/synthesis/scale-up", icon: Gauge },
  { title: "Start a Project", url: "/synthesis/enquiry", icon: Mail },
];

export function SynthesisShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
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

      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-background md:flex">
        <div className="px-5 py-5">
          <Link to="/" aria-label="APAC Supply Chain | CDMO home" className="press inline-block">
            <Logo className="h-10 w-auto" />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Custom Synthesis
          </p>
          <ul className="space-y-0.5">
            {SECTIONS.map((item) => (
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
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground",
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

        <div className="space-y-0.5 border-t border-border p-3">
          <Link
            to="/custom-synthesis"
            className="press flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Custom Synthesis overview
          </Link>
          <Link
            to="/"
            className="press flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to site
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main id="main-content" className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mb-6 animate-fade-up">
            <h1 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">{title}</h1>
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

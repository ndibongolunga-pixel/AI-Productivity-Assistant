import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Sparkles, LayoutDashboard } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Summarizer", icon: FileText },
  { to: "/tasks", label: "Task Planner", icon: ListChecks },
] as const;

export function AppShell({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground p-5 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="size-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Sparkles className="size-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <div className="font-display text-lg leading-none">{"\n"}</div>
            <div className="text-[11px] uppercase tracking-widest opacity-60">{"\n"}</div>
          </div>
        </Link>
        <nav className="flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                }`}
              >
                <Icon className="size-4" />
                <span>{label}</span>
                {active && <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-6 text-[11px] text-sidebar-foreground/50">
          Powered by Lovable AI
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="md:hidden border-b border-border bg-sidebar text-sidebar-foreground p-4 flex gap-3 overflow-x-auto">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-1.5 text-xs whitespace-nowrap px-2 py-1.5 rounded-md hover:bg-sidebar-accent"
              activeProps={{ className: "bg-sidebar-accent" }}
            >
              <Icon className="size-3.5" />
              {label}
            </Link>
          ))}
        </div>
        {children ?? <Outlet />}
      </main>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <div className="text-xs uppercase tracking-[0.18em] text-accent font-medium mb-2">
        {eyebrow}
      </div>
      <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground max-w-2xl">{description}</p>
    </div>
  );
}

export function ToolCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-card border border-border shadow-[0_1px_0_rgba(0,0,0,0.02),0_8px_24px_-12px_rgba(20,30,60,0.08)] p-6">
      {children}
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, ArrowRight, Sparkles, Clock, Zap } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Worklight — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate repetitive workplace tasks with AI. Draft emails, summarize meetings, and plan projects from a single workspace.",
      },
      { property: "og:title", content: "Worklight — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Automate repetitive workplace tasks with AI. Draft emails, summarize meetings, and plan projects from a single workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Email Generator",
    desc: "Draft professional emails in seconds with the right tone and structure.",
    accent: "from-accent/15 to-transparent",
  },
  {
    to: "/meetings" as const,
    icon: FileText,
    title: "Meeting Summarizer",
    desc: "Turn long transcripts into executive summaries, decisions, and action items.",
    accent: "from-accent/15 to-transparent",
  },
  {
    to: "/tasks" as const,
    icon: ListChecks,
    title: "Task Planner",
    desc: "Convert any goal into a clear task list with timeline and dependencies.",
    accent: "from-accent/15 to-transparent",
  },
];

const stats = [
  { icon: Clock, label: "Avg. time saved per task", value: "12 min" },
  { icon: Zap, label: "AI workflows ready", value: "3" },
  { icon: Sparkles, label: "Model", value: "Gemini 3 Flash" },
];

function Dashboard() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <PageHeader
          eyebrow="BubbleSpace"
          title="Focus on the work that matters."
          description="Worklight bundles three AI tools that automate the busywork around communication, meetings, and planning — so your day goes to high-value work."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-xl bg-card border border-border p-5 flex items-center gap-4"
            >
              <div className="size-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                <Icon className="size-5" />
              </div>
              <div>
                <div className="font-display text-xl text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tools.map(({ to, icon: Icon, title, desc, accent }) => (
            <Link
              key={to}
              to={to}
              className="group relative rounded-2xl bg-card border border-border p-6 overflow-hidden hover:border-accent/40 transition-colors"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity`}
              />
              <div className="relative">
                <div className="size-11 rounded-lg bg-primary text-primary-foreground flex items-center justify-center mb-5">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{desc}</p>
                <div className="flex items-center gap-1.5 text-sm text-accent font-medium">
                  Open tool
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-sidebar text-sidebar-foreground p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-accent font-medium mb-2">
              How it works
            </div>
            <h2 className="font-display text-2xl mb-2">One workspace. Three AI workflows.</h2>
            <p className="text-sm text-sidebar-foreground/70 max-w-xl">
              Each tool is purpose-built for a single high-friction task. Fill in a short form,
              get a polished, structured result you can edit, copy, and send.
            </p>
          </div>
          <Link
            to="/email"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Start with email
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

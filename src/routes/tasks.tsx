import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AppShell, PageHeader, ToolCard } from "@/components/AppShell";
import { AiOutput } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { planTasks } from "@/lib/ai.functions";
import { ListChecks } from "lucide-react";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Worklight" },
      {
        name: "description",
        content: "Convert any goal into an actionable task list with effort estimates, timeline, and dependencies.",
      },
      { property: "og:title", content: "AI Task Planner — Worklight" },
      {
        property: "og:description",
        content: "Convert any goal into an actionable task list with effort estimates, timeline, and dependencies.",
      },
    ],
  }),
  component: TasksPage,
});

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function TasksPage() {
  const fn = useServerFn(planTasks);
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState(todayPlus(14));
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Critical">("High");
  const [text, setText] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = goal.trim() && deadline.trim();

  const run = async () => {
    if (!valid) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fn({ data: { goal, deadline, priority } });
      setText(res?.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <PageHeader
          eyebrow="Planning"
          title="AI Task Planner"
          description="Describe a goal. Get a sequenced task list with effort estimates, a working-back timeline, and dependencies."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ToolCard>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run();
              }}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <Label htmlFor="goal">Goal</Label>
                <Textarea
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Launch a beta of our customer portal to 50 design partners"
                  rows={4}
                  maxLength={800}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                type="submit"
                disabled={!valid || loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <ListChecks className="size-4" />
                {loading ? "Planning…" : "Generate plan"}
              </Button>
            </form>
          </ToolCard>

          <AiOutput
            text={text}
            loading={loading}
            error={error}
            emptyHint="Describe a goal and deadline. We'll break it down into a sequenced plan you can act on today."
            onRegenerate={run}
            canRegenerate={!!text && !!valid}
          />
        </div>
      </div>
    </AppShell>
  );
}

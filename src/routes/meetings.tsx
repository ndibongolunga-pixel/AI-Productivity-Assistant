import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AppShell, PageHeader, ToolCard } from "@/components/AppShell";
import { AiOutput } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/ai.functions";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer — Worklight" },
      {
        name: "description",
        content: "Turn raw meeting transcripts into executive summaries, decisions, and clear action items.",
      },
      { property: "og:title", content: "Meeting Summarizer — Worklight" },
      {
        property: "og:description",
        content: "Turn raw meeting transcripts into executive summaries, decisions, and clear action items.",
      },
    ],
  }),
  component: MeetingsPage,
});

const SAMPLE = `Alex: Thanks everyone for joining. Quick agenda — Q3 launch readiness, the open bugs, and the marketing handoff.
Priya: On launch readiness, engineering is at 92% feature complete. We're confident about Sept 15 but it depends on the payments rework.
Jordan: Payments is the risk. We had two regression bugs this week. I want to slip the payments piece to a fast-follow rather than block launch.
Alex: Agreed. Let's launch Sept 15 with payments v1 (legacy flow) and ship v2 the following Friday.
Priya: I'll own the comms to customers about the staged rollout.
Jordan: I'll write the runbook for the v1 fallback and share by EOD Thursday.
Alex: Marketing — Sam, can the announcement push to Sept 16 morning?
Sam: Yes, we'll align the press release and the lifecycle email to a Sept 16 9am ET send.`;

function MeetingsPage() {
  const fn = useServerFn(summarizeMeeting);
  const [transcript, setTranscript] = useState("");
  const [text, setText] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = transcript.trim().length >= 20;

  const run = async () => {
    if (!valid) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fn({ data: { transcript } });
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
          eyebrow="Meetings"
          title="Meeting Notes Summarizer"
          description="Paste a transcript — get an executive summary, key decisions, action items, risks, and next steps."
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="transcript">Meeting transcript</Label>
                  <button
                    type="button"
                    className="text-xs text-accent hover:underline"
                    onClick={() => setTranscript(SAMPLE)}
                  >
                    Try a sample
                  </button>
                </div>
                <Textarea
                  id="transcript"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste the full meeting transcript here…"
                  rows={18}
                  maxLength={40000}
                  className="font-mono text-[13px] leading-relaxed"
                />
                <div className="text-xs text-muted-foreground">
                  {transcript.length.toLocaleString()} characters
                </div>
              </div>
              <Button
                type="submit"
                disabled={!valid || loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <FileText className="size-4" />
                {loading ? "Summarizing…" : "Summarize meeting"}
              </Button>
            </form>
          </ToolCard>

          <AiOutput
            text={text}
            loading={loading}
            error={error}
            emptyHint="Paste a transcript on the left. We'll structure it into the sections you actually need to share."
            onRegenerate={run}
            canRegenerate={!!text && valid}
          />
        </div>
      </div>
    </AppShell>
  );
}

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
import { generateEmail } from "@/lib/ai.functions";
import { Send } from "lucide-react";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "AI Email Generator — Worklight" },
      {
        name: "description",
        content: "Generate professional emails instantly. Pick a tone, add key points, get a polished draft.",
      },
      { property: "og:title", content: "AI Email Generator — Worklight" },
      {
        property: "og:description",
        content: "Generate professional emails instantly. Pick a tone, add key points, get a polished draft.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<"Professional" | "Friendly" | "Formal">("Professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [text, setText] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = purpose.trim() && recipient.trim() && keyPoints.trim();

  const run = async () => {
    if (!valid) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fn({ data: { purpose, recipient, tone, keyPoints } });
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
          eyebrow="Communication"
          title="AI Email Generator"
          description="Describe the email you need. We'll write a clean subject line, a polished body, and a suggested closing."
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
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Decline a meeting request"
                  maxLength={200}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="recipient">Recipient</Label>
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. Sarah, my product manager"
                  maxLength={120}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="keyPoints">Key points</Label>
                <Textarea
                  id="keyPoints"
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  placeholder="• Thank her for the invite&#10;• Conflict with another commitment&#10;• Suggest async update instead"
                  rows={6}
                  maxLength={1500}
                />
              </div>
              <Button
                type="submit"
                disabled={!valid || loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="size-4" />
                {loading ? "Generating…" : "Generate email"}
              </Button>
            </form>
          </ToolCard>

          <AiOutput
            text={text}
            loading={loading}
            error={error}
            emptyHint="Fill in the form to generate a draft you can copy straight into your inbox."
            onRegenerate={run}
            canRegenerate={!!text && valid}
          />
        </div>
      </div>
    </AppShell>
  );
}

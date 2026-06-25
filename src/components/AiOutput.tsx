import ReactMarkdown from "react-markdown";
import { Copy, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AiOutput({
  text,
  loading,
  error,
  emptyHint,
  onRegenerate,
  canRegenerate,
}: {
  text?: string;
  loading?: boolean;
  error?: string | null;
  emptyHint: string;
  onRegenerate?: () => void;
  canRegenerate?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-2xl bg-surface border border-border p-6 min-h-[420px] flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-medium">
          Result
        </div>
        <div className="flex gap-2">
          {canRegenerate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              disabled={loading}
              className="text-xs"
            >
              Regenerate
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={copy}
            disabled={!text || loading}
            className="text-xs"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            <span className="ml-1.5">{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>
      </div>

      <div className="flex-1">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3 py-12">
            <Loader2 className="size-6 animate-spin text-accent" />
            <span className="text-sm">Thinking…</span>
          </div>
        )}
        {!loading && error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}
        {!loading && !error && text && (
          <div className="prose-output">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        )}
        {!loading && !error && !text && (
          <div className="flex items-center justify-center h-full text-center text-sm text-muted-foreground py-12">
            <div className="max-w-xs">{emptyHint}</div>
          </div>
        )}
      </div>
    </div>
  );
}

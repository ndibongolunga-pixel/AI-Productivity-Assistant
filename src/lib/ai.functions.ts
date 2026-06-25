import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(MODEL);
}

function handleErr(e: unknown): never {
  const msg = e instanceof Error ? e.message : String(e);
  if (msg.includes("429")) throw new Error("Rate limit reached. Please try again in a moment.");
  if (msg.includes("402"))
    throw new Error("AI credits exhausted. Add credits to your Lovable workspace to continue.");
  throw new Error(msg);
}

const EmailInput = z.object({
  purpose: z.string().min(1),
  recipient: z.string().min(1),
  tone: z.enum(["Professional", "Friendly", "Formal"]),
  keyPoints: z.string().min(1),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => EmailInput.parse(data))
  .handler(async ({ data }) => {
    try {
      const { text } = await generateText({
        model: getModel(),
        system: "You are a professional business communication assistant.",
        prompt: `Write a concise and professional email based on:
Purpose: ${data.purpose}
Recipient: ${data.recipient}
Tone: ${data.tone}
Key Points: ${data.keyPoints}

Format your response in Markdown with these sections (use these exact headings):
## Subject Line
(the subject)

## Email Body
(the full body)

## Suggested Closing
(the closing line and signature suggestion)`,
      });
      return { text };
    } catch (e) {
      handleErr(e);
    }
  });

const SummarizeInput = z.object({
  transcript: z.string().min(20, "Transcript is too short"),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => SummarizeInput.parse(data))
  .handler(async ({ data }) => {
    try {
      const { text } = await generateText({
        model: getModel(),
        system: "You are an executive assistant.",
        prompt: `Summarize the following meeting transcript.

Provide a structured Markdown response with these exact headings:
## Executive Summary
## Key Decisions
## Action Items
## Risks
## Next Steps

Use bullet lists where appropriate.

Transcript:
${data.transcript}`,
      });
      return { text };
    } catch (e) {
      handleErr(e);
    }
  });

const PlanInput = z.object({
  goal: z.string().min(1),
  deadline: z.string().min(1),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => PlanInput.parse(data))
  .handler(async ({ data }) => {
    try {
      const { text } = await generateText({
        model: getModel(),
        system: "You are a project management expert.",
        prompt: `Break the following goal into actionable tasks.

Goal: ${data.goal}
Deadline: ${data.deadline}
Priority: ${data.priority}

Respond in Markdown with these exact headings:
## Task List
(numbered list, each task on its own line)

## Estimated Effort
(brief effort estimate per task or overall)

## Suggested Timeline
(milestone dates working backward from the deadline)

## Dependencies
(any blockers or task dependencies)`,
      });
      return { text };
    } catch (e) {
      handleErr(e);
    }
  });

# Worklight — AI Workplace Productivity Assistant

Worklight is a web-based AI productivity dashboard that combines three intelligent tools into a single workspace, helping professionals automate everyday workplace tasks — from drafting emails to summarizing meetings and planning projects.

## Features

- **AI Email Generator** — Draft professional emails instantly. Provide the purpose, recipient, tone, and key points; Worklight generates a polished email draft with a subject line, body, and closing. Supports Professional, Friendly, and Formal tones.

- **Meeting Notes Summarizer** — Paste raw meeting transcripts and receive structured outputs including an executive summary, key decisions, action items, risks, and next steps. Includes a sample transcript for quick testing.

- **AI Task Planner** — Convert any goal into a sequenced task list with effort estimates, a working-back timeline, and dependencies. Configure priority (Low, Medium, High, Critical) and deadline to tailor the plan.

### UX Highlights

- **Split-panel interface** — Inputs on the left, AI output on the right for every tool.
- **Copy-to-clipboard** — One-click copy on every AI response.
- **Regenerate** — Re-run generation with the same inputs to refine results.
- **Responsive design** — Optimized for desktop and tablet with a clean, minimal aesthetic.

## Tools & Technologies

| Layer | Technology |
|-------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19 + Vite) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix UI primitives) |
| AI Backend | Lovable AI Gateway (Google Gemini 3.5 Flash) |
| Server Functions | TanStack `createServerFn` |
| State Management | React `useState` + TanStack Query |
| Icons | Lucide React |
| Fonts | Fraunces (display), Inter (body) |

## Setup Instructions

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 20+
- A Lovable AI Gateway API key (for AI generation features)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd worklight
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```bash
   LOVABLE_API_KEY=your_lovable_ai_gateway_key
   ```

4. **Run the development server**

   ```bash
   bun run dev
   ```

   The app will be available at `http://localhost:8080`.

### Build for Production

```bash
bun run build
```

### Lint & Format

```bash
bun run lint
bun run format
```

## Project Structure

```
src/
  components/          # Reusable UI components (AppShell, AiOutput, etc.)
  components/ui/       # shadcn/ui primitives (Button, Input, Textarea, etc.)
  lib/
    ai.functions.ts    # Server functions for email, meeting, and task generation
    ai-gateway.server.ts  # Lovable AI Gateway configuration
  routes/
    __root.tsx         # Root layout, fonts, and meta tags
    index.tsx          # Dashboard / landing page
    email.tsx          # AI Email Generator
    meetings.tsx       # Meeting Notes Summarizer
    tasks.tsx          # AI Task Planner
  styles.css           # Global styles and Tailwind theme tokens
```

## License

MIT

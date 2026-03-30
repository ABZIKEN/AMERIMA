# PURE ai Prototype

PURE ai is a mobile-first web application prototype built with Next.js, TypeScript, and Tailwind CSS. It imitates an iPhone-style app experience in the browser for a food intelligence workflow.

## Features

- Welcome and onboarding flow with support for up to 2 diets and a primary diet selection.
- Simulated scan experience for food, products, and labels.
- Food result and product result cards with diet fit, macros, confidence, and PURE Certified status.
- Contextual chat flow with quick replies and real AI responses via `POST /api/ai` (OpenAI Responses API).
- Library and profile sections powered by reusable mock data.
- Centered mobile shell with an iOS-inspired visual presentation.
- Blue-forward PURE branding, animated launch splash, and ocean video accent in the main app header.
- Apple-like technology dashboard main menu with account panel and fast-action tiles.
- Expanded diet discovery flow: popular diets, explore list, per-diet deep dives, and an “I'm not sure” AI quiz recommender.
- Main launch path now lands into a profile-first dashboard with 8 quick actions (Scan food, Profile, Library, Explore, Recipes, AI Chat, Database, Diets).
- Bottom navigation now provides four fast buttons: Scan Food, AI Agent, Profile, Settings.

## Getting Started

### Install dependencies

```bash
npm install
```

### Configure AI

Create `.env.local` in the project root:

```bash
OPENAI_API_KEY=your_openai_api_key
# Optional override. Defaults to the bundled prompt model id below.
OPENAI_MODEL=pmpt_69ca06e27b848193a5b7bb81cdf8faac023d0663a75aefbe
```

### Run locally

```bash
npm run dev
```

Then open <http://localhost:3000>.

### Production build

```bash
npm run build
npm run start
```

## Project Structure

- `app/`: Next.js app router entrypoints and global styles.
- `components/`: Reusable app, layout, navigation, and UI components.
- `data/`: Local mock data for diets, scan results, chat, library, and profile content.
- `lib/`: Shared utilities.

## Notes

- This prototype uses mock local state for scanning, profile, and library content.
- AI chat is wired to a real server route (`app/api/ai/route.ts`) and requires `OPENAI_API_KEY`.
- Do not expose API keys in client-side code; keep them only in server environment variables.
- The UI is intentionally optimized for mobile width while remaining responsive in the browser.

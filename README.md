# PURE ai Prototype

PURE ai is a mobile-first web application prototype built with Next.js, TypeScript, and Tailwind CSS. It imitates an iPhone-style app experience in the browser for a food intelligence workflow.

## Features

- Welcome and onboarding flow with support for up to 2 diets and a primary diet selection.
- Simulated scan experience for food, products, and labels.
- Food result and product result cards with diet fit, macros, confidence, and PURE Certified status.
- Contextual chat flow with quick replies that visually update the verdict.
- Library and profile sections powered by reusable mock data.
- Centered mobile shell with an iOS-inspired visual presentation.

## Getting Started

### Install dependencies

```bash
npm install
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

- This prototype uses mock local state only.
- No real database, auth, camera, barcode scanning, or AI integration is included yet.
- The UI is intentionally optimized for mobile width while remaining responsive in the browser.

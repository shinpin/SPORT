# CLAUDE.md

## Project Overview

Football Shooting Challenge — a branded, mobile-first football shooting game built with React and TypeScript. The UI is entirely in Traditional Chinese (繁體中文). Players select a national team, play a dual-role striker/goalie game, earn score-based prizes, and can redeem coupons with AI-generated player card images.

Live app: https://ai.studio/apps/drive/1euzCH-T8pSHenEvBppEkkpOyBw_ivVHC

## Tech Stack

- **Language:** TypeScript 5.8
- **Framework:** React 19 (functional components, hooks)
- **Build tool:** Vite 6
- **Styling:** Tailwind CSS 3 (loaded via CDN in `index.html`)
- **Animation:** Framer Motion 12
- **Icons:** Lucide React
- **AI integration:** Google GenAI SDK (`@google/genai`) for player card image generation
- **Module system:** ES Modules

## Quick Start

```bash
npm install
# Set GEMINI_API_KEY in .env.local for AI image generation
npm run dev        # Dev server at http://localhost:3000
npm run build      # Production build
npm run preview    # Preview production build
```

## Project Structure

```
.
├── index.html              # HTML entry point (Tailwind CDN, import maps)
├── index.tsx               # React DOM mount point
├── App.tsx                 # Root component — game state machine, BGM, routing
├── types.ts                # Shared TypeScript interfaces
├── constants.ts            # Teams, prizes, goal positions, mock leaderboard
├── vite.config.ts          # Vite config (port 3000, path aliases, env vars)
├── tsconfig.json           # TypeScript config (ES2022, bundler resolution)
├── package.json            # Dependencies and scripts
├── metadata.json           # App metadata (name, permissions)
├── components/
│   ├── LoadingScreen.tsx   # Loading bar animation and entry screen
│   ├── StartScreen.tsx     # Team selection carousel, fullscreen toggle, hidden backstage access
│   ├── PairingScreen.tsx   # Match preview with random opponent selection
│   ├── GameScreen.tsx      # Core gameplay — striker/goalie mechanics, ball physics, scoring
│   ├── ResultScreen.tsx    # Game results display, prize tier unlocking
│   ├── RedeemScreen.tsx    # Prize redemption, OTP verification, AI-generated player cards
│   ├── LeaderboardScreen.tsx  # Rankings display
│   └── BackstagePanel.tsx  # Debug/QA panel (auto-test config, system monitoring)
└── BGM_*.mp3               # Background music audio assets
```

## Architecture

### Game State Machine

The app uses a screen-based state machine in `App.tsx`. The `gameState` variable drives which screen renders:

```
loading → start → pairing → playing → result → redeem → leaderboard
```

States are defined in `types.ts` as `GameState`.

### Component Patterns

- All components are **functional React components** using hooks (`useState`, `useEffect`, `useRef`, `useMemo`)
- State is managed at the component level and passed via **props** (no global state library)
- Animations use **Framer Motion** `motion.*` components and `AnimatePresence`
- Styling uses **Tailwind CSS** utility classes inline

### Key Game Mechanics

- **45-second game timer** per match
- **Dual-role system:** player alternates between Striker (shooting) and Goalie (saving)
- **Power charging:** hold-to-charge shot power; optimal range is 88–95
- **9-position goal grid:** 3x3 grid for both attacking and defending (defined in `GOAL_POSITIONS`)
- **Score-based prize tiers:** Gold (50+), Silver (30+), Bronze (<30)
- **Auto-test mode:** hidden backstage panel for automated QA testing

### External Dependencies

- **Google GenAI API** (`GEMINI_API_KEY`): generates AI player card images in RedeemScreen
- **Unsplash**: team jersey and avatar images (via direct URLs in constants)
- **GitHub raw content**: BGM audio file hosting

## Configuration

### Environment Variables

| Variable | Purpose | Where Set |
|----------|---------|-----------|
| `GEMINI_API_KEY` | Google GenAI API key for image generation | `.env.local` |

The key is injected at build time via `vite.config.ts` as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`.

### Path Aliases

`@/*` maps to the project root (configured in both `tsconfig.json` and `vite.config.ts`).

### Dev Server

Vite dev server runs on port **3000**, bound to `0.0.0.0` (all network interfaces).

## Code Conventions

- **Language in code comments and UI strings:** Traditional Chinese (繁體中文)
- **Component files:** PascalCase, one component per file in `components/`
- **Types:** defined in `types.ts`, imported where needed
- **Constants:** defined in `constants.ts` as exported arrays
- **No linter or formatter configured** — maintain consistency with existing code style
- **No automated tests** — changes should be verified manually via the dev server
- **No CI/CD pipeline** — deployments are manual

## Important Notes for AI Assistants

1. **No test suite exists.** Verify changes by running `npm run dev` and checking behavior in the browser.
2. **No linter/formatter.** Follow the existing code style (2-space indentation, single quotes in TSX, Tailwind utility classes).
3. **Tailwind is loaded via CDN** (`index.html`), not installed as an npm dependency. Do not try to install it or add a `tailwind.config.js`.
4. **Import maps in `index.html`** provide browser-native module resolution alongside Vite's bundling. Keep them in sync with `package.json` versions.
5. **BGM files** (~10 MB total) are committed to the repo. Avoid adding more large binary assets.
6. **`GameScreen.tsx` is the largest component** (~31 KB). When modifying gameplay logic, read the full file first to understand the existing flow.
7. **The backstage panel** is accessed via a hidden gesture on the StartScreen (long press). It provides auto-test configuration for QA.
8. **All UI text is in Traditional Chinese.** Maintain this convention for any new user-facing strings.

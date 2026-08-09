# OpenCode Agent Instructions

## Monorepo Structure
- `web/`: The frontend application (SvelteKit). Runs on default port `5173`.
- `backend/`: The backend API service (Express.js + SQLite). Runs on port `3000`.
- `app/`: The control app for this website (SvelteKit + Tailwind). Runs on port `5174`.

## Backend - Tech Stack
- **Framework**: Express.js
- **Database**: SQLite (via `better-sqlite3`)
- **API**: RESTful endpoints serving both public data to `web/` and admin operations to `app/`.

## Web - Tech Stack & Conventions
- **Framework**: SvelteKit using **Svelte 5 Runes** (`$state`, `$props`, `$derived`). Do not use Svelte 4 reactivity (`$:`, `let` for state).
- **Styling**: Vanilla CSS using CSS Variables (`var(--color-primary)`, `var(--spacing-md)`). Do not use Tailwind.
- **CSS Rules (Strict)**: 
  - Do NOT create utility classes.
  - Do NOT write inline styles.
  - Use standard CSS element targeting or BEM naming conventions for complex classes (e.g., `listing__info-count`).
  - Do NOT create a single-use utility class for one isolated change. 
- **Global State**: Managed via ES6 classes with `$state()` and `$derived` exported as singletons from `src/lib/*.svelte.ts` (e.g., `src/lib/cart.svelte.ts`). Follow this pattern for new global stores.
- **Animations & Scrolling**: Uses `gsap` (with `ScrollTrigger`) and `lenis` for smooth scrolling. Scroll integration is initialized globally in `src/routes/+layout.svelte`.
- **GSAP Skills**: When using GSAP, you MUST load and read ALL required GSAP skills relevant to the task (e.g., `gsap-core`, `gsap-scrolltrigger`, `gsap-frameworks`, etc.), not just some of them.

## App - Tech Stack & Conventions
- **Framework**: SvelteKit (Svelte 5 Runes)
- **Styling**: Tailwind CSS
- **Components**: `shadcn-svelte`

## Web - Directory Structure
- `src/routes/`: SvelteKit route components. The app is an e-commerce platform with dynamic routes like `category/[id]` and `product/[id]`.
- `src/lib/components/`: Reusable `.svelte` components.
- `src/lib/types.ts`: Central location for all TypeScript interfaces (e.g., `Product`, `Category`).

## Development Workflow
- **Web Server**: `cd web && npm run dev`
- **App Server**: `cd app && npm run dev`
- **Backend Server**: `cd backend && npm run dev`
- **Type Checking (Web/App)**: `cd <folder> && npm run check` (Runs `svelte-check`). *Note: There is no ESLint or Prettier currently configured.*
- **Build (Web/App)**: `cd <folder> && npm run build`

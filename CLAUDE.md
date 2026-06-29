# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`ferri` — "App deep-links with superpowers". A pnpm monorepo. The only package so far is the Next.js web app at `apps/app` (`@ferri/app`). `packages/*` is reserved for future shared packages but is currently empty.

## Commands

Run from the repo root. The root `package.json` scripts delegate into the workspace via pnpm filters:

- `pnpm dev` — start the app dev server (`next dev` in `@ferri/app`)
- `pnpm build` — build all packages (`pnpm -r build`)
- `pnpm start` — run the production build of the app
- `pnpm lint` — ESLint across all packages (`pnpm -r lint`)

To target the app directly: `pnpm --filter @ferri/app <script>`.

Requires Node >=20 and pnpm 10.7.1 (pinned via `packageManager`). There is a single lockfile at the repo root; the virtual store hoists to root `node_modules/.pnpm` — do not add per-package lockfiles or `pnpm-workspace.yaml` files inside packages.

No test runner is configured yet.

## App architecture (`apps/app`)

Next.js 16 App Router with React 19 and TypeScript (strict). Source lives under `src/`:

- `src/app/` — App Router routes. `layout.tsx` is the root layout (loads Geist fonts, sets `<html>`); `page.tsx` is the home route.
- Styling is CSS Modules (`*.module.css`) plus a global `globals.css`. No CSS framework.
- Import alias `@/*` maps to `apps/app/src/*` (see `tsconfig.json`).
- ESLint uses flat config (`eslint.config.mjs`) extending `eslint-config-next` core-web-vitals + typescript.

## Important: Next.js 16 is not the version in your training data

`apps/app/AGENTS.md` is authoritative: this Next.js release has breaking changes to APIs, conventions, and file structure that differ from prior versions. Before writing any Next.js code, read the relevant guide under `apps/app/node_modules/next/dist/docs/` and heed deprecation notices rather than relying on remembered patterns.

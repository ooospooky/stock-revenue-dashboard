# 台股月營收儀表板 — Stock Revenue Dashboard

A production-grade single-page dashboard for Taiwan stock monthly revenue data, built as a take-home project.

## Run

1. `pnpm install`
2. Copy `.env.example` to `.env.local`, set `FINMIND_TOKEN` (free account at [finmindtrade.com](https://finmindtrade.com/analysis/#/data/api))
3. `pnpm dev` → http://localhost:3000

## Stack

- **Next.js 16** — App Router, Route Handlers as BFF proxy
- **React 19** — client components with hooks
- **MUI v9** — theme system, `sx` prop styling, `AppRouterCacheProvider` for SSR
- **TanStack Query v5** — server state, `keepPreviousData` for smooth transitions
- **Recharts** — dual Y-axis `ComposedChart` (bar + line)
- **nuqs v2** — URL state (`?stockId=2330&range=5`) with zod validation
- **zod v4** — API response validation and URL param parsing
- **Vitest** — unit tests for the pure data layer

## Architecture Overview

The project is structured in three layers:

**Pure data layer** (`src/lib/`): Framework-free TypeScript functions — `calculateYoY`, `buildRevenueSeries`, `getRevenueDateRange`, and format helpers. All business logic lives here and is directly testable with Vitest. Zero React, zero Next.js imports.

**BFF / server** (`src/app/api/`): Next.js Route Handlers proxy requests to the FinMind API, keeping the `FINMIND_TOKEN` server-side only (`import 'server-only'` + no `NEXT_PUBLIC_` prefix). Responses are zod-validated before being passed to the client. Next.js `revalidate: 3600` provides 1-hour caching to stay within FinMind's rate limit.

**Client UI** (`src/components/`, `src/hooks/`): TanStack Query hooks fetch from `/api/*`. URL state is managed by nuqs with zod fallback to defaults. The `RevenueDashboard` container orchestrates four render branches (loading skeleton, error + retry, empty state, success).

See `docs/plans/2026-05-12-stock-revenue-dashboard-design.md` for the full design rationale and `docs/plans/2026-05-12-stock-revenue-dashboard-plan.md` for the implementation plan.

## Deployment

Vercel — one-click deploy. Set `FINMIND_TOKEN` as an environment variable in the Vercel project settings.

**Important:** The token must NOT be prefixed `NEXT_PUBLIC_` — it is server-only.

## Testing

```bash
pnpm test:run   # unit tests (pure data layer, 24 cases)
pnpm typecheck  # TypeScript strict check
pnpm lint       # ESLint
pnpm build      # production build verification
```

Integration tests are deferred. First candidate to add: the "switch range" flow — URL state → TanStack Query key change → `buildRevenueSeries` → table scroll reset.

## Out of Scope (Deliberate)

- **Custom date range** — FinMind API supports `start_date`/`end_date`; UI deferred. Considerations: DateRangePicker YoY-lookback semantics, MUI Pro licence, take-home scope.
- **Dark mode** — MUI theme is explicitly `mode: 'light'`; the `prefers-color-scheme` media query was removed from `globals.css`.
- **i18n** — UI is in Traditional Chinese; internationalisation not in scope.
- **Stock list virtualisation** — Current implementation shows the first 200 of ~3700 entries on open (full-text filter runs on keystroke). Upgrade path: MUI Autocomplete `ListboxComponent` + `react-window` if open-time exceeds 300ms in practice.
- **Integration tests** — See Testing section above.

## Decisions and Rationale

- `docs/plans/2026-05-12-stock-revenue-dashboard-design.md` — why this architecture
- `docs/plans/2026-05-12-stock-revenue-dashboard-plan.md` — implementation plan
- `history.md` — brainstorm dialogue capturing design decisions

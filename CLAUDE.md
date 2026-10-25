# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Waypoint is a personal Australian public transport companion, starting with Sydney / NSW (Transport for NSW). The goal is live departures, a live vehicle map, trip planning, and a phone-push arrival alarm. The backend is **event-driven**, and the durable arrival alarm is an **OpenWorkflow** workflow on Postgres. It is an independent project, not affiliated with any operator. See `AGENTS.md` for product/data constraints and the TfNSW API-key setup.

## Commands

```sh
npm install                       # repo root; links all workspaces
npm run db:up                     # start Postgres (Docker) — needed before dev
npm run dev                       # API (:8787) + workflow worker + web (:5173)
npm run check                     # type-check every workspace (tsc --noEmit)
npm run build                     # build every workspace
npm run db:down                   # stop Postgres

npm run dev        -w @waypoint/server  # API only
npm run dev:worker -w @waypoint/server  # workflow worker only
```

There is no test runner yet; `npm run check` is the type-level gate. `npm run dev` runs three processes (API, worker, web) via `concurrently`; the worker and API both need Postgres (`npm run db:up`) up first. In dev, Vite proxies `/api/*` to the backend, so the browser makes same-origin calls and never sees the TfNSW key.

## Architecture

Monorepo of npm workspaces with three rules that are the whole point of the structure — honour them:

1. **Frontend and backend never mix.** `apps/web` (browser) and `apps/server` (Node) do not import each other. The only shared code is `packages/shared`.
2. **Organise by feature, not by layer.** Each app's primary unit is `modules/<feature>/`, which owns everything for that feature. There is **no** global `controllers/`, `services/`, or `repositories/`. Cross-cutting infra lives in each app's `core/`.
3. **`packages/shared` is contract-only** — domain types (`Stop`, `Departure`, `VehiclePosition`, `TripPlan`, `Alarm`) and per-endpoint request/response shapes. No DOM, no Node, no runtime from either side. Both apps import it as `@waypoint/shared`.

```
packages/shared/src/        the FE<->BE contract types
apps/server/src/
  core/
    config.ts               env -> Config, read once, passed down
    http.ts                 Fastify app; mounts each module under /api
    events/                 bus.ts (typed in-process pub/sub) + events.ts (catalogue)
    workflow/               runtime.ts (OpenWorkflow + Postgres) + registry.ts
    providers/provider.ts   TransportProvider interface — the per-network seam
    providers/tfnsw/        shared TfNSW client (auth/base url) + gtfs-rt decode
    notify/ntfy.ts          phone-push delivery
  modules/<feature>/        index.ts (plugin) · routes.ts · <feature>.ts (logic)
                            · tfnsw.ts (mapping) · types.ts · workflow.ts (if durable)
  main.ts                   API process: builds runtime + bus, serves HTTP, ENQUEUES runs
  worker.ts                 worker process: executes enqueued workflows
apps/web/src/
  core/                     api/ (typed client + SSE stream), map/, ui/, store/
  modules/<feature>/        feature views; call core/api, never fetch directly
  main.ts                   mounts the app
```

### Key seams and conventions
- **Event-driven core:** `core/events/bus.ts` is a typed, synchronous, in-process pub/sub; `events.ts` is the domain-event catalogue (`vehicle.position.updated`, `trip.tracked`, `arrival.imminent`, `alarm.sent`, …). Modules publish/subscribe instead of calling each other. The live-map SSE endpoint (`modules/vehicles`) is a consumer. **The bus is per-process** — producer and consumer of an event must be in the same process; cross-process delivery (API ⇄ worker) would need Kafka / Postgres NOTIFY, deliberately not added yet.
- **Durable workflows (OpenWorkflow):** `core/workflow/runtime.ts` builds a Postgres-backed `OpenWorkflow` instance; `registry.ts` registers workflow definitions (each feature defines its own in `modules/<f>/workflow.ts`). **Two processes share one Postgres + a stable `namespaceId`:** the API (`main.ts`) enqueues runs via `workflows.<name>.run(input)`; the worker (`worker.ts`) executes them with durable `step.run` / `step.sleep`. The arrival alarm (`modules/alarms`) is the reference workflow: poll ETA → sleep → repeat → push once.
- **Provider seam:** `core/providers/provider.ts` defines `TransportProvider`; TfNSW is the only implementation. Per-feature mapping lives with the feature (`modules/<f>/tfnsw.ts`) on the shared `TfnswClient`. Adding a city = a new provider + mappers, no frontend change.
- **Module registration:** a backend feature is a Fastify plugin exported as `<feature>Module`, mounted under `/api` in `core/http.ts`, receiving only the collaborators it needs (`config`, `bus`, `workflows`). See `modules/health` (minimal) and `modules/stops` (full convention); each app's `modules/README.md` documents the layout.

## Current state

Structural skeleton. `health` works end to end (FE↔BE wiring). The event bus, SSE stream, and the OpenWorkflow runtime + worker + `track-arrival` workflow are wired and type-checked; the worker connects to Postgres on boot (verified up to the DB connection). Feature data (stop search, departures, vehicle positions, `pollArrival`) are stubs that throw "not implemented". Next milestones: live departures + vehicle map (which also feed the event bus), trip planning, and completing the alarm once departures land. When adding live behaviour, obey `AGENTS.md`: never fabricate departures, positions, fares, status, or durations a feed did not return.

## Code style

TypeScript throughout; `tsconfig.base.json` is extended per workspace (strict, `noUnusedLocals`/`noUnusedParameters`, `verbatimModuleSyntax` — use `import type` for types). Format with Prettier 3 (`npx -y prettier@3 --write`). Keep formatting changes separate from logic changes.

# Waypoint

A personal Australian public transport companion, starting with Sydney / NSW
(Transport for NSW). The aim is live departures, a live vehicle map, trip
planning, and a phone-push alarm when a tracked service is about to arrive.
Independent project, not affiliated with any transport operator.

## Structure

A monorepo of npm workspaces. Frontend and backend are kept strictly separate;
shared contract types sit in their own package.

- `packages/shared` — FE⇄BE contract types only.
- `apps/server` — backend (Fastify + TypeScript). Holds the TfNSW API key and an
  **event-driven** core; runs as **two processes** — an API that serves `/api`
  and enqueues work, and a worker that executes durable workflows. The arrival
  alarm is an **OpenWorkflow** workflow on **Postgres**.
- `apps/web` — frontend (Vite + TypeScript + MapLibre). Talks only to the
  backend's `/api` (including an SSE stream for the live map).

Each app is organised by feature under `modules/`, with cross-cutting
infrastructure under `core/`. See `AGENTS.md` and `CLAUDE.md` for the full
architecture and conventions.

## Run locally

Requires Docker (for Postgres) and Node ≥ 22.22.

```sh
npm install        # from the repo root
npm run db:up      # start Postgres in Docker
npm run dev        # API (:8787) + workflow worker + web (:5173)
```

Then open http://localhost:5173. The frontend proxies `/api/*` to the backend.
Stop Postgres with `npm run db:down`.

You need a free TfNSW Open Data API key for live data — see **TfNSW API key
setup** in `AGENTS.md`. Put it in `apps/server/.env` (copy `apps/server/.env.example`).

## Checks

```sh
npm run check      # type-check every workspace
npm run build      # build every workspace
```

## Status and limitations

Early rebuild. The skeleton is in place: the `health` endpoint wires frontend to
backend, and the event bus, live-map SSE stream, and the OpenWorkflow runtime +
worker + `track-arrival` workflow are wired and type-checked. Feature data (stop
search, departures, vehicle positions) is stubbed; live departures, the vehicle
map and completing the alarm are the next milestones. Live data will come only
from official TfNSW feeds — the app never invents departures, positions, fares,
service status or durations. Saved journeys and alarms are stored on your device,
not account-synced.

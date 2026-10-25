# Working on Waypoint

Waypoint is a personal, independent Australian public transport companion. The
goal is live departures, a live vehicle map, trip planning and an arrival alarm,
starting with Sydney / NSW (Transport for NSW). It is **not** affiliated with any
transport operator.

## Architecture (read this first)

Waypoint is a **monorepo** of npm workspaces. Three hard rules:

1. **Frontend and backend are strictly separated and never mixed.**
   `apps/web` (browser) and `apps/server` (Node) do not import from each other.
2. **Organise by feature module, not by technical layer.** The primary unit in
   each app is `modules/<feature>/`. There is **no** global `controllers/`,
   `services/`, or `repositories/`.
3. **Common code lives in a separate package.** `packages/shared` holds only the
   FE⇄BE contract — domain types and API request/response shapes. No DOM, no
   Node, no runtime from either side.

```
packages/shared     the FE<->BE contract (types only)
apps/server         backend: TfNSW key, event bus, workflow runtime; 2 processes
  src/core/           infra: config, http, events (bus), workflow (OpenWorkflow), providers, notify
  src/modules/<f>/    one feature each (stops, departures, vehicles, trips, alarms)
  src/main.ts         API process — serves /api, ENQUEUES workflow runs
  src/worker.ts       worker process — EXECUTES durable workflows
apps/web            frontend: Vite + MapLibre, talks only to the backend API
  src/core/           infra: api client (+ SSE stream), map, ui, store
  src/modules/<f>/    one feature each, mirroring the backend domains
```

The backend is **event-driven**: modules communicate through a typed in-process
event bus (`core/events`) rather than direct calls; the live-map stream is an SSE
consumer of `vehicle.position.updated`. The **durable arrival alarm** is an
**OpenWorkflow** workflow (`core/workflow`, `modules/alarms/workflow.ts`) backed by
**Postgres**: the API enqueues a run, the separate worker drives the countdown with
`step.sleep`, surviving restarts, and pushes one ntfy alarm.

Two deliberate boundaries:
- **The event bus is per-process.** Producer and consumer of an event must live in
  the same process. Cross-process delivery (API ⇄ worker) is **not** wired.
- **No Kafka (by choice).** For a single-user app it is operational overhead, and
  OpenWorkflow is SQL-backed, not a Kafka manager. If a streaming backbone or
  cross-process events are needed later, Kafka (or Postgres LISTEN/NOTIFY) slots in
  at exactly that boundary.

See `apps/server/src/modules/README.md` and `apps/web/src/modules/README.md` for
the per-module file convention, and `apps/server/src/core/providers/provider.ts`
for the `TransportProvider` seam — one provider per transport network, so adding
a city later means adding a provider, not changing the frontend.

## Commands

```sh
npm install            # from the repo root; links all workspaces
npm run db:up          # start Postgres (Docker) — required before dev
npm run dev            # API (:8787) + workflow worker + web (:5173)
npm run check          # type-checks every workspace
npm run build          # builds every workspace
npm run db:down        # stop Postgres

# single process
npm run dev        -w @waypoint/server   # API only
npm run dev:worker -w @waypoint/server   # workflow worker only
```

Postgres must be running (`npm run db:up`) before the API or worker start, and
both use the same `OW_NAMESPACE_ID` so they share workflow state. The frontend
proxies `/api/*` to the backend in dev, so the browser only ever sees same-origin
requests and never the TfNSW key.

## TfNSW API key setup

1. Create a free account at https://opendata.transport.nsw.gov.au and log in.
2. **My Account → Applications → Create Application**.
3. Subscribe the application to **Trip Planner** and **Public Transport –
   Realtime Vehicle Positions v2** (add **Timetables** if you need GTFS static).
4. Copy the application's **API Key**.
5. Put it in `apps/server/.env` as `TFNSW_API_KEY=...` (copy `.env.example`).
   `.env` is git-ignored; requests send it as `Authorization: apikey <key>`.

## Product and data requirements

- Keep bus and train planning central.
- Live data must come **only** from official feeds (TfNSW) via the backend.
  Never fabricate or guess departures, vehicle positions, fares, service status
  or journey durations a feed did not actually return. Label external links
  (operators, Google Maps) clearly.
- Any network illustration is decorative, not a navigation map.
- Saved journeys and alarms are stored locally on the user's device, not
  account-synced — don't describe them otherwise.
- Verify city/operator transport details against official operator sources.
- Use accessible labels, readable contrast, responsive layouts, and safe
  rendering of user-entered locations.

## Secrets and deployment

- GitHub repo: `paulortiz/waypoint`. Preserve remote history; never force-push
  without explicit authorization.
- Keys, tokens and `.env` files never go into source control or browser code.
  The TfNSW key lives server-side only. Any future secret-bearing integration
  stays in the backend.
- Update `README.md` and this file when setup, supported integrations or
  limitations change.

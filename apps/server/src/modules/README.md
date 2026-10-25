# Backend feature modules

Each subfolder is one feature and owns **everything** for it. There is no
global `controllers/`, `services/`, or `repositories/` layer — organise by
feature, not by technical role.

A module folder contains:

- `index.ts` — the module's Fastify plugin (its public entry). Registered in
  `core/http.ts`. Exported as `<feature>Module`.
- `routes.ts` — the HTTP routes for this feature (thin: parse, call logic,
  shape the response). Small modules may fold this into `index.ts`.
- `<feature>.ts` — the feature's domain logic.
- `tfnsw.ts` — this feature's mapping of TfNSW responses into the shared types,
  built on `core/providers/tfnsw/client.ts`. (Per-provider mapping lives with
  the feature, not in one giant adapter.)
- `types.ts` — types local to this module. Cross-boundary (FE<->BE) types live
  in `@waypoint/shared`, never here.

Cross-cutting infrastructure (config, server setup, provider client, GTFS-RT
decode, ntfy) lives in `core/`, shared within the backend only.

Planned modules: `stops`, `departures`, `vehicles`, `trips`, `alarms`.
`health` is the minimal reference example.

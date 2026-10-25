# Frontend core (shared within the web app only)

Cross-cutting infrastructure used by feature modules. Not feature-specific, and
never imported by the backend.

- `api/` — the single typed client to the backend (`client.ts`). Feature
  modules call `api.*`; they never `fetch` directly.
- `map/` — MapLibre GL setup/helpers for the live vehicle map (vehicles
  milestone).
- `ui/` — shared primitives, layout and base styles.
- `store/` — shared app state (selected city/stop, saved journeys, active
  alarms).

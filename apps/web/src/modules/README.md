# Frontend feature modules

Each subfolder is one feature and owns its view(s), local state and styles.
Organise by feature, not by technical role — there is no global `components/`
or `services/` layer here.

A module:

- exposes a mount/render entry (e.g. `mount<Feature>(root)`),
- calls the backend only through `core/api`,
- types everything via `@waypoint/shared`.

Planned modules mirror the backend domains: `stops`, `departures`, `vehicles`
(live map), `trips`, `alarms`. `health` is the minimal reference example that
proves the frontend can reach the backend.

import type {
  HealthResponse,
  StopsResponse,
  DeparturesResponse,
  VehiclesResponse,
} from "@waypoint/shared";

const BASE = "/api";

async function getJson<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
  const res = await fetch(`${BASE}${path}${qs}`);
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

/**
 * The single typed gateway to the backend. Feature modules import `api` and
 * never call `fetch` directly, so every request is typed by @waypoint/shared.
 */
export const api = {
  health: () => getJson<HealthResponse>("/health"),
  searchStops: (q: string) => getJson<StopsResponse>("/stops", { q }),
  departures: (stopId: string) =>
    getJson<DeparturesResponse>("/departures", { stopId }),
  vehicles: (params: Record<string, string> = {}) =>
    getJson<VehiclesResponse>("/vehicles", params),
};

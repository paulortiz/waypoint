import { api } from "../../core/api/client";

/**
 * Minimal reference module: proves the frontend can reach the backend through
 * the shared contract. Replace with the real landing/trip-planner view.
 */
export async function mountHealth(root: HTMLElement): Promise<void> {
  root.textContent = "Connecting to the Waypoint server…";
  try {
    const health = await api.health();
    root.textContent = `Connected: ${health.name} (${health.status}) at ${health.time}`;
  } catch (err) {
    root.textContent = `Server unreachable — is it running? ${(err as Error).message}`;
  }
}

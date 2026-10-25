import type { VehiclePosition } from "@waypoint/shared";

/**
 * Subscribes to the backend's live vehicle event stream (SSE) for the map.
 * Returns an unsubscribe function. The backend publishes
 * `vehicle.position.updated` events; each one is delivered here.
 */
export function streamVehicles(
  onPosition: (position: VehiclePosition) => void,
): () => void {
  const source = new EventSource("/api/vehicles/stream");
  source.addEventListener("vehicle.position.updated", (event) => {
    const data = (event as MessageEvent<string>).data;
    onPosition(JSON.parse(data) as VehiclePosition);
  });
  return () => {
    source.close();
  };
}

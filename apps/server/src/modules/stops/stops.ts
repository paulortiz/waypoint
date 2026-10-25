import type { Stop } from "@waypoint/shared";
import type { TfnswClient } from "../../core/providers/tfnsw/client";

/**
 * Searches stops by free text. Structural stub for now — the request shape and
 * response mapping (./tfnsw.ts) are in place; wire the live call in the stops
 * milestone:
 *
 *   const raw = await client.getJson<StopFinderResponse>("/v1/tp/stop_finder", {
 *     outputFormat: "rapidJSON", type_sf: "any", name_sf: query,
 *     coordOutputFormat: "EPSG:4326", TfNSWSF: "true",
 *   });
 *   return mapStopFinderResponse(raw);
 */
export async function searchStops(
  _client: TfnswClient,
  _query: string,
): Promise<Stop[]> {
  throw new Error("stops search not implemented yet (stops milestone)");
}

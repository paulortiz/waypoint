import type { Stop } from "@waypoint/shared";
import type { StopFinderResponse } from "./types";

/** Maps a TfNSW stop_finder response into our shared Stop list. */
export function mapStopFinderResponse(raw: StopFinderResponse): Stop[] {
  return (raw.locations ?? [])
    .filter((loc) => loc.type === "stop" || loc.type === "platform")
    .map((loc) => ({
      id: loc.id,
      name: loc.disassembledName ?? loc.name,
      lat: loc.coord?.[0],
      lon: loc.coord?.[1],
    }));
}

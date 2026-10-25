import type { VehiclePosition } from "@waypoint/shared";

/**
 * Decodes GTFS-Realtime vehicle-position protobuf feeds into our shared
 * VehiclePosition type.
 *
 * Wired up in the vehicles milestone using `gtfs-realtime-bindings`:
 *   const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage
 *     .decode(new Uint8Array(buffer));
 * then map feed.entity[].vehicle -> VehiclePosition.
 */
export function decodeVehiclePositions(
  _buffer: ArrayBuffer,
): VehiclePosition[] {
  throw new Error(
    "GTFS-Realtime decoding not implemented yet (vehicles milestone).",
  );
}

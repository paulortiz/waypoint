import type { Config } from "../../core/config";
import { pushNotification } from "../../core/notify/ntfy";
import type { ArrivalStatus, TrackArrivalInput } from "./types";

/**
 * Returns the tracked service's current ETA at the stop. Structural stub until
 * the departures milestone wires live TfNSW data — at that point this reads the
 * real-time departure/vehicle feed and computes minutes-to-arrival.
 */
export async function pollArrival(
  _input: TrackArrivalInput,
): Promise<ArrivalStatus> {
  throw new Error("arrival polling not implemented yet (departures milestone)");
}

/** Delivers the "your service is near" push via ntfy. Runs inside the worker. */
export async function pushArrivalAlarm(
  ntfy: Config["ntfy"],
  input: TrackArrivalInput,
  arrival: ArrivalStatus,
): Promise<void> {
  await pushNotification(ntfy, {
    title: "Your service is near",
    body: `${input.routeName ?? "Your service"} is about ${String(arrival.etaMinutes)} min away`,
    tags: ["bus", "alarm_clock"],
    priority: 5,
  });
}

import type { OpenWorkflow } from "openworkflow";
import type { Config } from "../../core/config";
import { pollArrival, pushArrivalAlarm } from "./alarms";
import type { TrackArrivalInput, TrackArrivalResult } from "./types";

export interface TrackArrivalDeps {
  ntfy: Config["ntfy"];
}

const RECHECK_INTERVAL = "30s"; // OpenWorkflow DurationString
const MAX_CHECKS = 120; // ~1 hour of tracking at 30s cadence

/**
 * Durable workflow: poll the tracked service until it is within the rider's
 * lead time, push exactly one alarm, then finish. Because OpenWorkflow
 * persists each step, the countdown survives a worker restart and resumes
 * where it left off instead of re-notifying or losing the alarm.
 */
export function defineTrackArrival(ow: OpenWorkflow, deps: TrackArrivalDeps) {
  return ow.defineWorkflow<TrackArrivalInput, TrackArrivalResult>(
    { name: "track-arrival" },
    async ({ input, step }) => {
      for (let i = 0; i < MAX_CHECKS; i++) {
        const arrival = await step.run({ name: `check-eta-${String(i)}` }, () =>
          pollArrival(input),
        );

        if (arrival.etaMinutes <= input.leadMinutes) {
          await step.run({ name: `notify-${String(i)}` }, () =>
            pushArrivalAlarm(deps.ntfy, input, arrival),
          );
          return { notified: true, finalEtaMinutes: arrival.etaMinutes };
        }

        await step.sleep(`recheck-${String(i)}`, RECHECK_INTERVAL);
      }

      return { notified: false };
    },
  );
}

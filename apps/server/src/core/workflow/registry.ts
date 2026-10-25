import type { OpenWorkflow } from "openworkflow";
import type { Config } from "../config";
import { defineTrackArrival } from "../../modules/alarms/workflow";

/**
 * All workflow definitions, built on a given OpenWorkflow instance. Both the
 * API process (to enqueue runs via `.run()`) and the worker process (to execute
 * them) build this registry so they agree on workflow names and shapes.
 */
export interface WorkflowRegistry {
  trackArrival: ReturnType<typeof defineTrackArrival>;
}

export function registerWorkflows(
  ow: OpenWorkflow,
  config: Config,
): WorkflowRegistry {
  return {
    trackArrival: defineTrackArrival(ow, { ntfy: config.ntfy }),
  };
}

import type { FastifyPluginAsync } from "fastify";
import type { WorkflowRegistry } from "../../core/workflow/registry";
import { registerAlarmsRoutes } from "./routes";

export interface AlarmsModuleOptions {
  workflows: WorkflowRegistry;
}

/** Arrival-alarm feature. Enqueues the durable track-arrival workflow. */
export const alarmsModule: FastifyPluginAsync<AlarmsModuleOptions> = async (
  app,
  opts,
) => {
  registerAlarmsRoutes(app, opts.workflows);
};

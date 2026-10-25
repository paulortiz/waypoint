import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import type { Config } from "./config";
import type { EventBus } from "./events/bus";
import type { WorkflowRegistry } from "./workflow/registry";
import { healthModule } from "../modules/health";
import { stopsModule } from "../modules/stops";
import { vehiclesModule } from "../modules/vehicles";
import { alarmsModule } from "../modules/alarms";

export interface BuildServerDeps {
  config: Config;
  bus: EventBus;
  workflows: WorkflowRegistry;
}

/**
 * Builds the Fastify app and mounts each feature module under `/api`. Modules
 * receive only the collaborators they need (config, the event bus, the workflow
 * registry) — there is no controller/service layer; a module owns its routes
 * and logic.
 */
export async function buildServer(deps: BuildServerDeps): Promise<FastifyInstance> {
  const { config, bus, workflows } = deps;
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });

  await app.register(healthModule, { prefix: "/api" });
  await app.register(stopsModule, { prefix: "/api", config });
  await app.register(vehiclesModule, { prefix: "/api", bus });
  await app.register(alarmsModule, { prefix: "/api", workflows });

  return app;
}

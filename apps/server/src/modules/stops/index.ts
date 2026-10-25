import type { FastifyPluginAsync } from "fastify";
import type { Config } from "../../core/config";
import { registerStopsRoutes } from "./routes";

export interface StopsModuleOptions {
  config: Config;
}

/** Stop search feature. Public entry registered in core/http.ts. */
export const stopsModule: FastifyPluginAsync<StopsModuleOptions> = async (
  app,
  opts,
) => {
  registerStopsRoutes(app, opts.config);
};

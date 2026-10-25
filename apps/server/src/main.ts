import "dotenv/config";
import { loadConfig } from "./core/config";
import { buildServer } from "./core/http";
import { EventBus } from "./core/events/bus";
import { createWorkflowRuntime } from "./core/workflow/runtime";

const config = loadConfig();
const bus = new EventBus();

// The API process connects to the workflow backend to ENQUEUE runs; it does
// not run a worker. Execution happens in the worker process (worker.ts).
const runtime = await createWorkflowRuntime(config);

const app = await buildServer({ config, bus, workflows: runtime.workflows });

try {
  await app.listen({ port: config.port, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  await runtime.stop();
  process.exit(1);
}

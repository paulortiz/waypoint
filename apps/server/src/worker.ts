import "dotenv/config";
import { loadConfig } from "./core/config";
import { createWorkflowRuntime } from "./core/workflow/runtime";

/**
 * The workflow worker process. It builds the same workflow registry as the API
 * and continuously executes enqueued runs (polling, sleeping, pushing the
 * alarm), independently of the HTTP server. Run alongside the API with
 * `npm run dev:worker`.
 */
const config = loadConfig();
const runtime = await createWorkflowRuntime(config);
const worker = runtime.ow.newWorker({ concurrency: 4 });

await worker.start();
// eslint-disable-next-line no-console
console.log("[waypoint] workflow worker started");

async function shutdown(): Promise<void> {
  await worker.stop();
  await runtime.stop();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());

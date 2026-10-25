import { OpenWorkflow } from "openworkflow";
import { BackendPostgres } from "openworkflow/postgres";
import type { Config } from "../config";
import { registerWorkflows, type WorkflowRegistry } from "./registry";

/**
 * The OpenWorkflow runtime: a Postgres-backed engine plus the registered
 * workflows. Created once per process. The API process uses it to enqueue
 * runs; the worker process uses it to execute them (see worker.ts).
 */
export interface WorkflowRuntime {
  ow: OpenWorkflow;
  backend: BackendPostgres;
  workflows: WorkflowRegistry;
  stop: () => Promise<void>;
}

export async function createWorkflowRuntime(
  config: Config,
): Promise<WorkflowRuntime> {
  const backend = await BackendPostgres.connect(config.database.url, {
    // Stable + shared across API and worker so they see each other's runs.
    namespaceId: config.workflow.namespaceId,
  });
  const ow = new OpenWorkflow({ backend });
  const workflows = registerWorkflows(ow, config);

  return {
    ow,
    backend,
    workflows,
    stop: async () => {
      await backend.stop();
    },
  };
}

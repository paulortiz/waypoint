import type { Config } from "../config";

export interface PushMessage {
  title: string;
  body: string;
  /** Optional emoji/keyword tags shown by the ntfy client. */
  tags?: string[];
  /** 1 (min) .. 5 (max). */
  priority?: 1 | 2 | 3 | 4 | 5;
}

/**
 * Pushes a message to the configured ntfy topic. The alarm scheduler calls
 * this when a tracked service is within its lead time. Subscribe to the same
 * topic in the ntfy phone app to receive it.
 */
export async function pushNotification(
  config: Config["ntfy"],
  message: PushMessage,
): Promise<void> {
  if (!config.topic) {
    throw new Error("NTFY_TOPIC is not set — cannot deliver alarm push.");
  }
  const res = await fetch(`${config.baseUrl}/${config.topic}`, {
    method: "POST",
    headers: {
      Title: message.title,
      ...(message.tags ? { Tags: message.tags.join(",") } : {}),
      ...(message.priority ? { Priority: String(message.priority) } : {}),
    },
    body: message.body,
  });
  if (!res.ok) {
    throw new Error(`ntfy push failed: ${res.status} ${res.statusText}`);
  }
}

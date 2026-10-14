import { z } from "zod";
import { agentConfig } from "./config";

const { limits } = agentConfig;

export const historySchema = z
  .array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().trim().min(1).max(limits.maxMessageChars * 4),
    }),
  )
  .max(limits.maxTurns * 2);

export type History = z.infer<typeof historySchema>;

export const chatBodySchema = z.object({
  messages: historySchema.refine((m) => m.length > 0 && m[m.length - 1].role === "user", {
    message: "last message must be from the user",
  }),
});

/** Keeps the latest turns, starting with a user message, as the API requires. */
export function trimHistory(history: History): History {
  const recent = history.slice(-limits.maxTurns);
  const firstUser = recent.findIndex((m) => m.role === "user");
  return firstUser === -1 ? [] : recent.slice(firstUser);
}

// In-memory sliding window per IP. Good enough for one server instance; on a
// multi-instance host (Vercel) move this to a shared store such as Upstash Redis.
const hits = new Map<string, number[]>();

export function rateLimited(ip: string, now = Date.now()) {
  const windowStart = now - limits.windowMs;
  const recent = (hits.get(ip) ?? []).filter((t) => t > windowStart);
  if (recent.length >= limits.requestsPerWindow) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) {
    for (const [k, v] of hits) if (v[v.length - 1] <= windowStart) hits.delete(k);
  }
  return false;
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

export function jsonError(status: number, message: string) {
  return Response.json({ error: message }, { status });
}

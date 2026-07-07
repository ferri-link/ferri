import { Redis } from "@upstash/redis";

// Shared client for the KV match store. The HTTP client is stateless, so a
// single instance is safely reused across requests.
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

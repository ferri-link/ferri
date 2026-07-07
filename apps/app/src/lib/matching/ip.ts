import { createHmac } from "node:crypto";

// Peppered hash of a client IP. The raw IP is never stored; the capture and
// match sides must hash with the same stable pepper for anchors to line up.
// IPv4 has only ~4B values, so an unsalted hash would be trivially reversible —
// the pepper is a required secret.
export function hashIp(ip: string): string {
  const pepper = process.env.IP_HASH_PEPPER;
  if (!pepper) {
    throw new Error("IP_HASH_PEPPER is not set");
  }
  return createHmac("sha256", pepper).update(ip).digest("hex");
}

"use server";

import { actionClient } from "@/lib/handlers/action";
import { enrichClickSignals as enrichClickSignalsInStore } from "@/lib/matching/click";
import { enrichClickSignalsSchema } from "@/lib/schema/click";

// Enriches a recorded click with the client-only signals the intermediate page
// collects (timezone, screen). Public — the visitor isn't a signed-in user, and
// the unguessable clickId is the capability.
export const enrichClickSignals = actionClient
  .inputSchema(enrichClickSignalsSchema)
  .action(async ({ parsedInput: { clickId, timezone, screen } }) => {
    await enrichClickSignalsInStore(clickId, { timezone, screen });
  });

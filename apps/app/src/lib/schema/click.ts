import * as z from "zod";

// Client-collected signals sent by the intermediate page to enrich a click.
export const enrichClickSignalsSchema = z.object({
  clickId: z.string().min(1),
  timezone: z.string().optional(),
  screen: z
    .object({
      width: z.number(),
      height: z.number(),
      scale: z.number(),
    })
    .optional(),
});

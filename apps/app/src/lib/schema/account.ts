import * as z from "zod";

export const displayNameSchema = z
  .string()
  .trim()
  .min(2, "Enter at least 2 characters.")
  .max(50, "Keep it under 50 characters.");

export const updateDisplayNameSchema = z.object({
  displayName: displayNameSchema,
});

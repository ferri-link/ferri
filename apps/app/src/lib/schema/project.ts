import * as z from "zod";

export const projectNameSchema = z
  .string()
  .trim()
  .min(1, "Enter a project name.")
  .max(60, "Keep the name under 60 characters.");

export const projectSlugSchema = z
  .string()
  .trim()
  .min(1, "Enter a slug.")
  .max(60, "Keep the slug under 60 characters.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and hyphens.",
  );

export const createProjectSchema = z.object({
  name: projectNameSchema,
  slug: projectSlugSchema,
});

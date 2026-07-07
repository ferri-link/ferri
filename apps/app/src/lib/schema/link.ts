import * as z from "zod";

// Only localhost is available while the product is in development. Additional
// domains will be added to this list as they become available.
export const LINK_DOMAINS = ["localhost"] as const;

export const linkDomainSchema = z.enum(LINK_DOMAINS, {
  message: "Choose a domain.",
});

export const linkCodeSchema = z
  .string()
  .trim()
  .min(1, "Enter a code.")
  .max(60, "Keep the code under 60 characters.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and hyphens.",
  );

export const linkFolderSchema = z.string().min(1, "Choose a folder.");

export const createLinkSchema = z.object({
  projectId: z.string().min(1),
  domain: linkDomainSchema,
  code: linkCodeSchema,
  folderId: linkFolderSchema,
});

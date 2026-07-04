import * as z from "zod";

export const FOLDER_DESCRIPTION_MAX_LENGTH = 200;

export const folderNameSchema = z
  .string()
  .trim()
  .min(1, "Enter a folder name.")
  .max(60, "Keep the name under 60 characters.");

export const folderDescriptionSchema = z
  .string()
  .trim()
  .max(
    FOLDER_DESCRIPTION_MAX_LENGTH,
    `Keep the description under ${FOLDER_DESCRIPTION_MAX_LENGTH} characters.`,
  );

export const createFolderSchema = z.object({
  projectId: z.string().min(1),
  name: folderNameSchema,
  description: folderDescriptionSchema,
});

export const deleteFolderSchema = z.object({
  projectId: z.string().min(1),
  folderId: z.string().min(1),
});

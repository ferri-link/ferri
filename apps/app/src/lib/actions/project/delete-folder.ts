"use server";

import { prisma } from "@ferri/db";
import { revalidatePath } from "next/cache";

import { projectActionClient } from "@/lib/handlers/action";
import { deleteFolderSchema } from "@/lib/schema/folder";
import { paths } from "@/lib/utils/paths";

export const deleteFolder = projectActionClient
  .inputSchema(deleteFolderSchema)
  .action(async ({ parsedInput: { projectId, folderId } }) => {
    // Scope the delete to the project so a folder id from another project can't
    // be removed even if it slipped past the membership guard.
    await prisma.folder.deleteMany({ where: { id: folderId, projectId } });

    revalidatePath(paths.projects.id(projectId).folders);
  });

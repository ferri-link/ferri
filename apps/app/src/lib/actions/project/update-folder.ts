"use server";

import { prisma } from "@ferri/db";
import { revalidatePath } from "next/cache";

import { projectActionClient } from "@/lib/handlers/action";
import { updateFolderSchema } from "@/lib/schema/folder";
import { paths } from "@/lib/utils/paths";

export const updateFolder = projectActionClient
  .inputSchema(updateFolderSchema)
  .action(
    async ({ parsedInput: { projectId, folderId, name, description } }) => {
      // Scope the update to the project so a folder id from another project
      // can't be edited even if it slipped past the membership guard.
      await prisma.folder.updateMany({
        where: { id: folderId, projectId },
        data: { name, description: description || null },
      });

      revalidatePath(paths.projects.id(projectId).folders);
    },
  );

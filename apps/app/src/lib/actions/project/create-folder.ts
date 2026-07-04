"use server";

import { prisma } from "@ferri/db";
import { revalidatePath } from "next/cache";

import { projectActionClient } from "@/lib/handlers/action";
import { createFolderSchema } from "@/lib/schema/folder";
import { paths } from "@/lib/utils/paths";

export const createFolder = projectActionClient
  .inputSchema(createFolderSchema)
  .action(async ({ parsedInput: { projectId, name, description } }) => {
    await prisma.folder.create({
      data: { projectId, name, description: description || null },
    });

    revalidatePath(paths.projects.id(projectId).folders);
  });

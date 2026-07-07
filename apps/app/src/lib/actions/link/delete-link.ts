"use server";

import { prisma } from "@ferri/db";
import { revalidatePath } from "next/cache";

import { projectActionClient } from "@/lib/handlers/action";
import { deleteLinkSchema } from "@/lib/schema/link";
import { paths } from "@/lib/utils/paths";

export const deleteLink = projectActionClient
  .inputSchema(deleteLinkSchema)
  .action(async ({ parsedInput: { projectId, linkId } }) => {
    // Scope the delete to the project so a link id from another project can't
    // be removed even if it slipped past the membership guard.
    await prisma.link.deleteMany({ where: { id: linkId, projectId } });

    revalidatePath(paths.projects.id(projectId).links);
  });

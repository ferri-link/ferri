"use server";

import { Prisma, prisma } from "@ferri/db";
import { returnValidationErrors } from "next-safe-action";
import { revalidatePath } from "next/cache";

import { projectActionClient } from "@/lib/handlers/action";
import { createLinkSchema } from "@/lib/schema/link";
import { paths } from "@/lib/utils/paths";

export const createLink = projectActionClient
  .inputSchema(createLinkSchema)
  .action(async ({ parsedInput: { projectId, domain, code, folderId } }) => {
    // Guard the folder against the project so a folder id from another
    // project can't be attached even if it slipped past the client.
    const folder = await prisma.folder.findFirst({
      where: { id: folderId, projectId },
      select: { id: true },
    });

    if (!folder) {
      returnValidationErrors(createLinkSchema, {
        folderId: { _errors: ["Choose a folder."] },
      });
    }

    await prisma.link
      .create({ data: { projectId, folderId, domain, code } })
      .catch((error: unknown) => {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          returnValidationErrors(createLinkSchema, {
            code: { _errors: ["This code is already taken."] },
          });
        }
        console.error(error);
        throw error;
      });

    revalidatePath(paths.projects.id(projectId).links);
  });

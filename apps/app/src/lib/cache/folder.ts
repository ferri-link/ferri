import { prisma } from "@ferri/db";
import { cache } from "react";

// Cached per request: the folders belonging to the given project, newest first.
export const getProjectFolders = cache(async (projectId: string) => {
  return prisma.folder.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
});

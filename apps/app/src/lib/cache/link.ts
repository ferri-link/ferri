import { prisma } from "@ferri/db";
import { cache } from "react";

// Cached per request: the links belonging to the given project, newest first,
// with the name of the folder each one lives in.
export const getProjectLinks = cache(async (projectId: string) => {
  return prisma.link.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: { folder: { select: { name: true } } },
  });
});

export type ProjectLink = Awaited<ReturnType<typeof getProjectLinks>>[number];

import { prisma } from "@ferri/db";
import { cache } from "react";

// Cached per request: the projects the given user is a member of.
export const getUserMemberships = cache(async (userId: string) => {
  return prisma.projectMember.findMany({
    where: { userId },
    include: { project: true },
    orderBy: { createdAt: "asc" },
  });
});

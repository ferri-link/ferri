"use server";

import { Prisma, prisma } from "@ferri/db";
import { returnValidationErrors } from "next-safe-action";

import { userActionClient } from "@/lib/handlers/action";
import { createProjectSchema } from "@/lib/schema/project";

export const createProject = userActionClient
  .inputSchema(createProjectSchema)
  .action(async ({ parsedInput: { name, slug }, ctx: { user } }) => {
    try {
      const project = await prisma.project.create({
        data: {
          name,
          slug,
          members: {
            create: { userId: user.id, role: "owner" },
          },
        },
      });

      return { id: project.id, slug: project.slug };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        returnValidationErrors(createProjectSchema, {
          slug: { _errors: ["This slug is already taken."] },
        });
      }
      throw error;
    }
  });

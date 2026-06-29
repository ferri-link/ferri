"use server";

import { Prisma, prisma } from "@ferri/db";
import { returnValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";

import { userActionClient } from "@/lib/handlers/action";
import { createProjectSchema } from "@/lib/schema/project";
import { paths } from "@/lib/utils/paths";

export const createProject = userActionClient
  .inputSchema(createProjectSchema)
  .action(async ({ parsedInput: { name, slug }, ctx: { user } }) => {
    const project = await prisma.project
      .create({
        data: {
          name,
          slug,
          members: {
            create: { userId: user.id, role: "owner" },
          },
        },
      })
      .catch((error: unknown) => {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          returnValidationErrors(createProjectSchema, {
            slug: { _errors: ["This slug is already taken."] },
          });
        }
        throw error;
      });

    redirect(paths.projects.id(project.id).index);
  });

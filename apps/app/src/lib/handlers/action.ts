import { createSafeActionClient } from "next-safe-action";
import { redirect } from "next/navigation";

import { getUserMemberships } from "@/lib/cache/membership";
import { getUser } from "@/lib/cache/user";
import { authErrorMessage } from "@/lib/supabase/error";
import { hasProjectAccess } from "@/lib/utils/project";
import { paths } from "@/lib/utils/paths";

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    return authErrorMessage(error);
  },
});

// Requires a signed-in user and injects it into the action context as
// `ctx.user`. Redirects to sign-in if the session is gone.
export const userActionClient = actionClient.use(async ({ next }) => {
  const user = await getUser();

  if (!user) {
    redirect(paths.auth.index);
  }

  return next({ ctx: { user } });
});

// Builds on `userActionClient` for actions scoped to a single project. The
// action's input must carry a `projectId`; this guards that the signed-in user
// is a member of it and injects the resolved project as `ctx.project`.
export const projectActionClient = userActionClient.use(
  async ({ next, ctx, clientInput }) => {
    const projectId = (clientInput as { projectId?: unknown } | undefined)
      ?.projectId;

    if (typeof projectId !== "string") {
      throw new Error("A project is required.");
    }

    const memberships = await getUserMemberships(ctx.user.id);
    const membership = memberships.find((m) => m.project.id === projectId);

    if (!membership) {
      throw new Error("You don't have access to this project.");
    }

    if (!hasProjectAccess(membership.project)) {
      throw new Error("This project is still on the waitlist.");
    }

    return next({ ctx: { project: membership.project } });
  },
);

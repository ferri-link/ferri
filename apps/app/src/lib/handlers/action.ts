import { createSafeActionClient } from "next-safe-action";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/cache/user";
import { authErrorMessage } from "@/lib/supabase/error";
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

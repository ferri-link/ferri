import { redirect } from "next/navigation";

import { getUser } from "@/lib/cache/user";
import { paths } from "@/lib/utils/paths";

// Requires a signed-in user, but allows one who hasn't finished onboarding.
// Redirects to sign-in when there's no session. Use on pages that must stay
// reachable mid-onboarding, such as the create-account page itself.
export async function fetchUserIfNotCompleted() {
  const user = await getUser();

  if (!user) {
    redirect(paths.auth.index);
  }

  return user;
}

// Requires a signed-in user who has finished onboarding (has a display name).
// Redirects to sign-in when signed out, or to create-account when not yet
// onboarded. Use on the main, post-onboarding app pages.
export async function fetchUser() {
  const user = await fetchUserIfNotCompleted();

  if (!user.user_metadata?.display_name) {
    redirect(paths.account.create);
  }

  return user;
}

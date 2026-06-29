import { redirect } from "next/navigation";

import { getUser } from "@/lib/cache/user";

// Requires a signed-in user, but allows one who hasn't finished onboarding.
// Redirects to sign-in when there's no session. Use on pages that must stay
// reachable mid-onboarding, such as the create-account page itself.
export async function fetchUserIfNotCompleted() {
  const user = await getUser();

  if (!user) {
    redirect("/auth");
  }

  return user;
}

// Requires a signed-in user who has finished onboarding (has a display name).
// Redirects to sign-in when signed out, or to create-account when not yet
// onboarded. Use on the main, post-onboarding app pages.
export async function fetchUser() {
  const user = await fetchUserIfNotCompleted();

  if (!user.user_metadata?.display_name) {
    redirect("/account/create");
  }

  return user;
}

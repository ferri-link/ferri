"use server";

import { redirect } from "next/navigation";

import { getUserMemberships } from "@/lib/cache/membership";
import { actionClient } from "@/lib/handlers/action";
import { verifySchema } from "@/lib/schema/auth";
import { createClient } from "@/lib/supabase/server";
import { paths } from "@/lib/utils/paths";

export const verifySignInCode = actionClient
  .inputSchema(verifySchema)
  .action(async ({ parsedInput: { email, code } }) => {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    if (error) throw error;

    // New users haven't picked a display name yet.
    if (!user?.user_metadata?.display_name) {
      redirect(paths.account.create);
    }

    // Signed in but no project yet — start by creating one.
    const memberships = await getUserMemberships(user.id);
    if (memberships.length === 0) {
      redirect(paths.projects.create);
    }

    redirect(paths.projects.id(memberships[0].project.id).index);
  });

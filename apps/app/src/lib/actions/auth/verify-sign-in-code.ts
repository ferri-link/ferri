"use server";

import { actionClient } from "@/lib/handlers/action";
import { verifySchema } from "@/lib/schema/auth";
import { createClient } from "@/lib/supabase/server";

export const verifySignInCode = actionClient
  .inputSchema(verifySchema)
  .action(async ({ parsedInput: { email, code } }) => {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    if (error) throw error;

    // New users haven't picked a display name yet — the form routes them to
    // onboarding.
    return { needsOnboarding: !user?.user_metadata?.display_name };
  });

"use server";

import { actionClient } from "@/lib/handlers/action";
import { signInSchema } from "@/lib/schema/auth";
import { createClient } from "@/lib/supabase/server";

export const sendSignInCode = actionClient
  .inputSchema(signInSchema)
  .action(async ({ parsedInput: { email } }) => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) throw error;
  });

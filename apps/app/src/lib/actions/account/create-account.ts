"use server";

import { actionClient } from "@/lib/handlers/action";
import { createAccountSchema } from "@/lib/schema/account";
import { createClient } from "@/lib/supabase/server";

export const createAccount = actionClient
  .inputSchema(createAccountSchema)
  .action(async ({ parsedInput: { displayName } }) => {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName },
    });
    if (error) throw error;
  });

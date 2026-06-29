"use server";

import { actionClient } from "@/lib/handlers/action";
import { updateDisplayNameSchema } from "@/lib/schema/account";
import { createClient } from "@/lib/supabase/server";

export const updateDisplayName = actionClient
  .inputSchema(updateDisplayNameSchema)
  .action(async ({ parsedInput: { displayName } }) => {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName },
    });
    if (error) throw error;
  });

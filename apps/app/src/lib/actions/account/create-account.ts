"use server";

import { redirect } from "next/navigation";

import { userActionClient } from "@/lib/handlers/action";
import { createAccountSchema } from "@/lib/schema/account";
import { createClient } from "@/lib/supabase/server";
import { paths } from "@/lib/utils/paths";

export const createAccount = userActionClient
  .inputSchema(createAccountSchema)
  .action(async ({ parsedInput: { displayName } }) => {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName },
    });
    if (error) throw error;

    redirect(paths.projects.create);
  });

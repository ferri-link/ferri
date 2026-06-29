"use server";

import { redirect } from "next/navigation";

import { userActionClient } from "@/lib/handlers/action";
import { createClient } from "@/lib/supabase/server";
import { paths } from "@/lib/utils/paths";

export const signOut = userActionClient.action(async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect(paths.auth.index);
});

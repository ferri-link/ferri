import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

// Cached for the duration of a single request, so the layout and any nested
// pages/components reuse one `getUser()` call instead of each re-validating.
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

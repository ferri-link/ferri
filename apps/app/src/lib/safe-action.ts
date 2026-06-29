import { createSafeActionClient } from "next-safe-action";

import { authErrorMessage } from "@/lib/supabase/error";

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    return authErrorMessage(error);
  },
});

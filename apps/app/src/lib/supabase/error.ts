import { isAuthError } from "@supabase/supabase-js";

// Maps a Supabase auth failure to a user-facing message.
export function authErrorMessage(error: unknown): string {
  if (isAuthError(error)) {
    if (error.code === "otp_disabled") {
      return "Sign-ups are currently disabled.";
    }
    if (error.code === "otp_expired") {
      return "That code is invalid or has expired.";
    }
    if (error.status === 429) {
      return "Too many attempts. Please wait a moment and try again.";
    }
  }
  return "Something went wrong. Please try again.";
}

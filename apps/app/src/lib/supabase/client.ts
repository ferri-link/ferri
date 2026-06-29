import { createBrowserClient } from "@supabase/ssr";

// Supabase client for use in Client Components ("use client").
// Handles auth and storage; the database is accessed via Prisma (@ferri/db).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

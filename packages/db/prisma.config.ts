import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Load this package's .env so the Prisma CLI sees DATABASE_URL / DIRECT_URL.
loadEnv({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations/introspection must use the direct (session-mode) connection;
    // Supabase's transaction-mode pooler can't run them.
    url: process.env["DIRECT_URL"],
  },
});

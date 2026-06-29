import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ferri/db ships TypeScript source (including the generated Prisma client),
  // so Next needs to transpile it.
  transpilePackages: ["@ferri/db"],
};

export default nextConfig;

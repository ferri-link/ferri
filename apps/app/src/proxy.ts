import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

// The /api and /link folders are internal rewrite targets, not public paths.
function isInternalPath(pathname: string): boolean {
  return (
    pathname === "/api" ||
    pathname.startsWith("/api/") ||
    pathname === "/link" ||
    pathname.startsWith("/link/")
  );
}

// Host-based routing. External hosts map onto internal folders:
//   API_HOST     → /api/*           device-facing API
//   link domains → /link/{host}/*   link resolution (any host that isn't the
//                                    dashboard or the API)
//   APP_HOST     → served as-is      dashboard
export async function proxy(request: NextRequest) {
  // Internal folders are reachable only through a proxy rewrite (which does not
  // re-run the proxy). A direct request for them, on any host, is a 404.
  if (isInternalPath(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  const host = request.headers.get("host") ?? "";

  // Dashboard: serve app routes unchanged, refreshing the Supabase session.
  if (host === process.env.APP_HOST) {
    return updateSession(request);
  }

  const url = request.nextUrl.clone();

  // Device API: route into the /api folder.
  if (host === process.env.API_HOST) {
    url.pathname = `/api${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Any other host is a link domain: route into /link/{host}.
  url.pathname = `/link/${host}${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals and static assets so their paths aren't rewritten.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

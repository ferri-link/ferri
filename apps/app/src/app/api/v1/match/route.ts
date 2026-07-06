import { NextResponse } from "next/server";

// POST /api/v1/match — device-facing endpoint.
// Resolves the link a device is attributed to on first launch.
// Dummy response for now: no auth, no validation, no matching.
export async function POST() {
  return NextResponse.json({
    linkId: null,
  });
}

"use client";

import { useEffect } from "react";

import { enrichClickSignals } from "@/lib/actions/public/enrich-click-signals";

// Collects the client-only signals a server redirect can't see (timezone,
// screen) and enriches the already-recorded click. Best-effort: the server-side
// click stands on its own if this fails or JS never runs.
export function ClickIntermediate({ clickId }: { clickId: string }) {
  useEffect(() => {
    // Fire-and-forget for now. Once a real redirect replaces this placeholder,
    // await this before navigating so the enrichment isn't cut off.
    void enrichClickSignals({
      clickId,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        scale: window.devicePixelRatio,
      },
    }).catch(() => {
      // Best-effort; ignore failures.
    });
  }, [clickId]);

  return <main>Redirecting…</main>;
}

import { prisma } from "@ferri/db";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { buildClickInput } from "@/lib/matching/capture";
import { recordClick } from "@/lib/matching/click";

import { ClickIntermediate } from "./intermediate";

export default async function LinkRedirectPage({
  params,
}: {
  // `domain` is supplied by the proxy rewrite (host → path segment), not the
  // public URL — links resolve at {domain}/{code}.
  params: Promise<{ domain: string; code: string }>;
}) {
  const { domain, code } = await params;

  const link = await prisma.link.findUnique({
    where: { domain_code: { domain, code } },
    select: { id: true },
  });
  if (!link) notFound();

  const requestHeaders = await headers();
  const click = buildClickInput(requestHeaders, link.id);

  // Record the click, best-effort — a KV failure must never block the redirect.
  try {
    await recordClick(click);
  } catch (error) {
    console.error("[click] failed to record", error);
  }

  // The intermediate page collects client-only signals (timezone, screen) and
  // enriches the recorded click. The real redirect (to the destination / store,
  // carrying the clickId) comes later — Link has no destination field yet.
  return <ClickIntermediate clickId={click.clickId} />;
}

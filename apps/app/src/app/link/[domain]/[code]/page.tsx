import { prisma } from "@ferri/db";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { buildClickInput } from "@/lib/matching/capture";
import { recordClick } from "@/lib/matching/click";

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

  // Record the click, best-effort — a KV failure must never block the redirect.
  try {
    const requestHeaders = await headers();
    const click = buildClickInput(requestHeaders, link.id);
    await recordClick(click);
  } catch (error) {
    console.error("[click] failed to record", error);
  }

  // Placeholder: the real redirect (to the destination / store, carrying the
  // clickId) comes later — Link has no destination field yet.
  return (
    <main>
      Redirecting {domain}/{code}…
    </main>
  );
}

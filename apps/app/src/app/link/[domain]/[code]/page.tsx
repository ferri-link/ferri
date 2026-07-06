export default async function LinkRedirectPage({
  params,
}: {
  // `domain` is supplied by the proxy rewrite (host → path segment), not the
  // public URL — links resolve at {domain}/{code}.
  params: Promise<{ domain: string; code: string }>;
}) {
  const { domain, code } = await params;

  // Placeholder: this route will resolve the link for (domain, code) and
  // redirect to its destination. Lookup + redirect not implemented yet.
  return (
    <main>
      Redirecting {domain}/{code}…
    </main>
  );
}

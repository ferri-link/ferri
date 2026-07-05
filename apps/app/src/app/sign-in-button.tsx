"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";

export function SignInButton({ href }: { href: string }) {
  const router = useRouter();

  // Press "s" anywhere to jump to sign in.
  useHotkeys("s", () => router.push(href), { preventDefault: true });

  return (
    <Button render={<Link href={href} />}>
      Sign in
      <Kbd>S</Kbd>
    </Button>
  );
}

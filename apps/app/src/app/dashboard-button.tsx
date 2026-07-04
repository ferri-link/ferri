"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";

export function DashboardButton({ href }: { href: string }) {
  const router = useRouter();

  // Press "d" anywhere to jump to the dashboard.
  useHotkeys("d", () => router.push(href), { preventDefault: true });

  return (
    <Button render={<Link href={href} />}>
      Dashboard
      <Kbd>D</Kbd>
    </Button>
  );
}

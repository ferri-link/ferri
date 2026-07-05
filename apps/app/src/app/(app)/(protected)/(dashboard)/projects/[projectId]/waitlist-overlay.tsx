import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { paths } from "@/lib/utils/paths";

// Server-rendered gate shown over the dashboard while a project is still on the
// waitlist. Unlike a portalled dialog, this is part of the layout's initial
// HTML, so it paints together with the page — no post-hydration pop-in or enter
// animation. It's a non-interactive visual lock; project mutations are gated
// separately server-side (see projectActionClient).
export function WaitlistOverlay({ projectName }: { projectName: string }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 supports-backdrop-filter:backdrop-blur-xs"
    >
      <div className="flex w-full max-w-md flex-col gap-2 rounded-4xl bg-popover p-6 text-popover-foreground ring-1 ring-foreground/5">
        <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
          <Logo className="size-6" />
        </div>
        <h2
          id="waitlist-title"
          className="font-heading text-base leading-none font-medium"
        >
          Thanks, you&apos;re on the waitlist!
        </h2>
        <p className="text-sm text-muted-foreground">
          {projectName}
          {" is waiting for access to Ferri."}
          <br />
          {"We’ll email you the moment it’s ready."}
        </p>
        <div className="mt-4 flex justify-start">
          <Link href={paths.index} className={buttonVariants()}>
            <ArrowLeftIcon />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}

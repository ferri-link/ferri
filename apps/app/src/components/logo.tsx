import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";
import { paths } from "@/lib/utils/paths";

// Inline version of the app icon (app/icon.svg). Uses currentColor so it adapts to the
// surrounding text color in both light and dark themes.
export function Logo(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M8 10 l12 14 -12 14" opacity={0.25} />
      <path d="M19 10 l12 14 -12 14" opacity={0.55} />
      <path d="M30 10 l12 14 -12 14" />
    </svg>
  );
}

// The brand mark (icon + wordmark) as a link to the landing page. Shared by the
// landing header and the dashboard sidebar so it always renders identically —
// same color, no background or interactive state from its surroundings.
export function Wordmark({
  className,
  ...props
}: Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link
      href={paths.index}
      className={cn(
        "flex items-center gap-2 text-lg font-semibold tracking-tight",
        className,
      )}
      {...props}
    >
      <Logo className="size-6" />
      Ferri
    </Link>
  );
}

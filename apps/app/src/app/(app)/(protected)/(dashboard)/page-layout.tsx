import type { ReactNode } from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function PageLayout({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b p-4">
        <div className="flex min-h-9 items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-medium tracking-tight">{title}</h1>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  );
}

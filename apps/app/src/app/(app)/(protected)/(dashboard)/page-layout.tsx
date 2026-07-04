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
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex items-center justify-between gap-4 border-b p-4">
        <div className="flex items-center gap-2 min-h-9">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-medium tracking-tight">{title}</h1>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}

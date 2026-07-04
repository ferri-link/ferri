import type { ReactNode } from "react";

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
      <header className="flex items-start justify-between gap-4 border-b pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}

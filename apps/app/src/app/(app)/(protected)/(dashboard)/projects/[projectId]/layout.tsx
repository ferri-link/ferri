import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { fetchProject } from "@/lib/handlers/page";

import { AppSidebar } from "./sidebar";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await fetchProject(projectId);

  return (
    <SidebarProvider className="h-svh">
      <AppSidebar projectId={projectId} />
      <SidebarInset className="min-h-0 overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

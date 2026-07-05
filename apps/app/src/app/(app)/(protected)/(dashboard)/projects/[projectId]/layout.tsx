import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { fetchProject } from "@/lib/handlers/page";
import { hasProjectAccess } from "@/lib/utils/project";

import { AppSidebar } from "./sidebar";
import { WaitlistOverlay } from "./waitlist-overlay";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const { project } = await fetchProject(projectId);

  // Members of a project still on the waitlist see the dashboard behind a
  // non-dismissable overlay rather than being redirected away.
  const waitlist = !hasProjectAccess(project);

  return (
    <SidebarProvider className="h-svh">
      <AppSidebar projectId={projectId} />
      <SidebarInset className="min-h-0 overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </SidebarInset>
      {waitlist && <WaitlistOverlay projectName={project.name} />}
    </SidebarProvider>
  );
}

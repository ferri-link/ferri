import { redirect } from "next/navigation";

import { paths } from "@/lib/utils/paths";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(paths.projects.id(projectId).settings.preferences);
}

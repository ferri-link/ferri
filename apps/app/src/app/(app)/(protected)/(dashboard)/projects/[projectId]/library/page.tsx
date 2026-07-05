import { redirect } from "next/navigation";

import { paths } from "@/lib/utils/paths";

export default async function LibraryPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(paths.projects.id(projectId).library.folders);
}

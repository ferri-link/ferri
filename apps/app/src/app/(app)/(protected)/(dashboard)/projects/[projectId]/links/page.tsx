import type { Metadata } from "next";

import { getProjectFolders } from "@/lib/cache/folder";

import { PageLayout } from "../../../page-layout";
import { CreateLinkDialog } from "./create-dialog";
import { LinksEmpty } from "./empty";

export const metadata: Metadata = {
  title: "Links",
};

export default async function LinksPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const folders = await getProjectFolders(projectId);

  return (
    <PageLayout
      title="Links"
      action={<CreateLinkDialog folders={folders} projectId={projectId} />}
    >
      <LinksEmpty />
    </PageLayout>
  );
}

import type { Metadata } from "next";

import { getProjectFolders } from "@/lib/cache/folder";

import { PageLayout } from "../../../page-layout";
import { CreateFolderDialog } from "./create-folder-dialog";
import { FolderList } from "./folder-list";
import { FoldersEmpty } from "./folders-empty";

export const metadata: Metadata = {
  title: "Folders",
};

export default async function FoldersPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const folders = await getProjectFolders(projectId);

  return (
    <PageLayout
      title="Folders"
      action={<CreateFolderDialog projectId={projectId} />}
    >
      {folders.length === 0 ? (
        <FoldersEmpty />
      ) : (
        <FolderList folders={folders} />
      )}
    </PageLayout>
  );
}

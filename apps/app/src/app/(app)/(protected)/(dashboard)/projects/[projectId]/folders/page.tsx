import type { Metadata } from "next";

import { PageLayout } from "../../../page-layout";
import { CreateFolderDialog } from "./create-folder-dialog";

export const metadata: Metadata = {
  title: "Folders",
};

export default async function FoldersPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <PageLayout
      title="Folders"
      action={<CreateFolderDialog projectId={projectId} />}
    />
  );
}

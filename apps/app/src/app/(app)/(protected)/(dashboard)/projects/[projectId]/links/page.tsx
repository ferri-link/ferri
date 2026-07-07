import type { Metadata } from "next";

import { getProjectFolders } from "@/lib/cache/folder";
import { getProjectLinks } from "@/lib/cache/link";

import { PageLayout } from "../../../page-layout";
import { CreateLinkDialog } from "./create-dialog";
import { LinksEmpty } from "./empty";
import { LinkList } from "./list";

export const metadata: Metadata = {
  title: "Links",
};

export default async function LinksPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [folders, links] = await Promise.all([
    getProjectFolders(projectId),
    getProjectLinks(projectId),
  ]);

  return (
    <PageLayout
      title="Links"
      action={<CreateLinkDialog folders={folders} projectId={projectId} />}
    >
      {links.length === 0 ? (
        <LinksEmpty />
      ) : (
        <LinkList projectId={projectId} links={links} />
      )}
    </PageLayout>
  );
}

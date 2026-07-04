import type { FolderModel } from "@ferri/db";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { FolderActions } from "./actions";

export function FolderList({
  projectId,
  folders,
}: {
  projectId: string;
  folders: FolderModel[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {folders.map((folder) => (
        <Card key={folder.id}>
          <CardHeader>
            <CardTitle>{folder.name}</CardTitle>
            {folder.description ? (
              <CardDescription>{folder.description}</CardDescription>
            ) : (
              "-"
            )}
            <CardAction>
              <FolderActions projectId={projectId} folder={folder} />
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

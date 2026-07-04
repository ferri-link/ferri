import type { FolderModel } from "@ferri/db";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FolderList({ folders }: { folders: FolderModel[] }) {
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
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

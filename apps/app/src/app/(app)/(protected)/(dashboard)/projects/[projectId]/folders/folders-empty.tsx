import { FolderClosedIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function FoldersEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderClosedIcon />
        </EmptyMedia>
        <EmptyTitle>No folders yet</EmptyTitle>
        <EmptyDescription>
          Create a folder to organize your links.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

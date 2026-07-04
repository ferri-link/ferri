import { LinkIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function LinksEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LinkIcon />
        </EmptyMedia>
        <EmptyTitle>No links yet</EmptyTitle>
        <EmptyDescription>
          Create a link to share a deep link for your project.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

import { TagsIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function AttributesEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TagsIcon />
        </EmptyMedia>
        <EmptyTitle>No attributes yet</EmptyTitle>
        <EmptyDescription>
          Add attributes to enrich your deep links with custom values.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

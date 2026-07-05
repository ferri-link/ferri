import { ZapIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function ActionsEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ZapIcon />
        </EmptyMedia>
        <EmptyTitle>No actions yet</EmptyTitle>
        <EmptyDescription>
          Create an action to run when your deep links are opened.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

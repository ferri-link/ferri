import * as React from "react";

import { cn } from "@/lib/utils";

// Small muted fine-print text (captions, legal notices, helper lines).
// Any nested links are styled automatically.
function Caption({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="caption"
      className={cn(
        "text-muted-foreground text-xs",
        "[&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary",
        className,
      )}
      {...props}
    />
  );
}

export { Caption };

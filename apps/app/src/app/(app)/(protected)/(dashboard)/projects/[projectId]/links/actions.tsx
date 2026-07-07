"use client";

import { EllipsisIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import type { ProjectLink } from "@/lib/cache/link";
import { useDialogParam } from "@/hooks/use-dialog";

import { DeleteLinkDialog } from "./delete-dialog";

export function LinkActions({
  projectId,
  link,
}: {
  projectId: string;
  link: ProjectLink;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useDialogParam("delete-link", link.id);

  // While this link's menu is open, Backspace deletes.
  useHotkeys(
    "backspace",
    () => {
      setMenuOpen(false);
      setConfirmOpen(true);
    },
    {
      enabled: menuOpen,
      preventDefault: true,
      eventListenerOptions: { capture: true },
    },
  );

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Link actions" />
          }
        >
          <EllipsisIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2Icon />
            Delete
            <Kbd className="ml-auto">⌫</Kbd>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteLinkDialog
        projectId={projectId}
        link={link}
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
      />
    </>
  );
}

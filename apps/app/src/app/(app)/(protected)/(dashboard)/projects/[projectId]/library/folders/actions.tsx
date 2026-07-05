"use client";

import type { FolderModel } from "@ferri/db";
import { EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react";
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
import { useDialogParam } from "@/hooks/use-dialog";

import { DeleteFolderDialog } from "./delete-dialog";
import { EditFolderDialog } from "./edit-dialog";

export function FolderActions({
  projectId,
  folder,
}: {
  projectId: string;
  folder: FolderModel;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useDialogParam("edit-folder", folder.id);
  const [confirmOpen, setConfirmOpen] = useDialogParam(
    "delete-folder",
    folder.id,
  );

  // While this folder's menu is open, "e" edits and Backspace deletes. These
  // run in the capture phase so they fire before the menu's built-in typeahead,
  // which would otherwise swallow the "e" key.
  const menuHotkeyOptions = {
    enabled: menuOpen,
    preventDefault: true,
    eventListenerOptions: { capture: true },
  };

  useHotkeys(
    "e",
    () => {
      setMenuOpen(false);
      setEditOpen(true);
    },
    menuHotkeyOptions,
  );

  useHotkeys(
    "backspace",
    () => {
      setMenuOpen(false);
      setConfirmOpen(true);
    },
    menuHotkeyOptions,
  );

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Folder actions"
            />
          }
        >
          <EllipsisIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <PencilIcon />
            Edit
            <Kbd className="ml-auto">E</Kbd>
          </DropdownMenuItem>
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

      <EditFolderDialog
        projectId={projectId}
        folder={folder}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteFolderDialog
        projectId={projectId}
        folder={folder}
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
      />
    </>
  );
}

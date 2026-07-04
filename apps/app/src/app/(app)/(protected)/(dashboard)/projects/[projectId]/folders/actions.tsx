"use client";

import type { FolderModel } from "@ferri/db";
import { EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { Spinner } from "@/components/ui/spinner";
import { deleteFolder } from "@/lib/actions/project/delete-folder";

import { EditFolderDialog } from "./edit-dialog";

export function FolderActions({
  projectId,
  folder,
}: {
  projectId: string;
  folder: FolderModel;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    try {
      await deleteFolder({ projectId, folderId: folder.id });
      setConfirmOpen(false);
    } finally {
      setPending(false);
    }
  }

  // ⌘/Ctrl+Enter confirms the delete while the alert is open.
  useHotkeys("mod+enter", () => void handleDelete(), {
    enabled: confirmOpen && !pending,
    preventDefault: true,
  });

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

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete folder?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes “{folder.name}” folder. This can’t be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>
              Cancel
              <Kbd>Esc</Kbd>
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={pending}
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              {pending && <Spinner />}
              Delete
              <Kbd>⌘ ⏎</Kbd>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

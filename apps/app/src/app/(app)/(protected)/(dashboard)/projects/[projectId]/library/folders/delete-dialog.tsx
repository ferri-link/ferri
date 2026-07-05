"use client";

import type { FolderModel } from "@ferri/db";
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
import { Kbd } from "@/components/ui/kbd";
import { Spinner } from "@/components/ui/spinner";
import { deleteFolder } from "@/lib/actions/project/delete-folder";

export function DeleteFolderDialog({
  projectId,
  folder,
  open,
  onOpenChange,
}: {
  projectId: string;
  folder: FolderModel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setPending(true);
    try {
      const result = await deleteFolder({ projectId, folderId: folder.id });
      if (result?.serverError) {
        setError(result.serverError);
        return;
      }
      onOpenChange(false);
    } finally {
      setPending(false);
    }
  }

  // ⌘/Ctrl+Enter confirms the delete while the alert is open.
  useHotkeys("mod+enter", () => void handleDelete(), {
    enabled: open && !pending,
    preventDefault: true,
  });

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          setError(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete folder?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes “{folder.name}” folder. This can’t be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
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
  );
}

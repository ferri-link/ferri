"use client";

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
import { deleteLink } from "@/lib/actions/link/delete-link";
import type { ProjectLink } from "@/lib/cache/link";

export function DeleteLinkDialog({
  projectId,
  link,
  open,
  onOpenChange,
}: {
  projectId: string;
  link: ProjectLink;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setPending(true);
    try {
      const result = await deleteLink({ projectId, linkId: link.id });
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
          <AlertDialogTitle>Delete link?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes “{link.domain}/{link.code}”. This can’t be
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

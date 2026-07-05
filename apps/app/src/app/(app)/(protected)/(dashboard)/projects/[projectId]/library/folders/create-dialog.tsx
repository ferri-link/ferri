"use client";

import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useDialogParam } from "@/hooks/use-dialog";
import { createFolder } from "@/lib/actions/project/create-folder";

import { FolderFormDialog } from "./folder-form-dialog";

export function CreateFolderDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useDialogParam("create-folder");

  // Press "c" to open the dialog. react-hotkeys-hook ignores keystrokes typed
  // in form fields by default, and it's disabled while the dialog is open.
  useHotkeys("c", () => setOpen(true), {
    enabled: !open,
    preventDefault: true,
  });

  return (
    <FolderFormDialog
      open={open}
      onOpenChange={setOpen}
      title="Create new folder"
      description="Use folders to organize links."
      submitLabel="Create folder"
      defaultValues={{ name: "", description: "" }}
      action={(values) => createFolder({ projectId, ...values })}
      trigger={
        <Button>
          Create folder
          <Kbd>C</Kbd>
        </Button>
      }
    />
  );
}

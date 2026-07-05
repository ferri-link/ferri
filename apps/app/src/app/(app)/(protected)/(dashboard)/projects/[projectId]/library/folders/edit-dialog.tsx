"use client";

import type { FolderModel } from "@ferri/db";

import { updateFolder } from "@/lib/actions/project/update-folder";

import { FolderFormDialog } from "./folder-form-dialog";

export function EditFolderDialog({
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
  return (
    <FolderFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit folder"
      description="Update the folder's name and description."
      submitLabel="Save changes"
      defaultValues={{
        name: folder.name,
        description: folder.description ?? "",
      }}
      action={(values) =>
        updateFolder({ projectId, folderId: folder.id, ...values })
      }
    />
  );
}

"use client";

import type { FolderModel } from "@ferri/db";
import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { useDialogParam } from "@/hooks/use-dialog";

import { CreateLinkForm } from "./form";

export function CreateLinkDialog({
  folders,
  projectId,
}: {
  folders: FolderModel[];
  projectId: string;
}) {
  const [open, setOpen] = useDialogParam("create-link");

  // Press "c" to open the dialog. react-hotkeys-hook ignores keystrokes typed
  // in form fields by default, and it's disabled while the dialog is open.
  useHotkeys("c", () => setOpen(true), {
    enabled: !open,
    preventDefault: true,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            Create link
            <Kbd>C</Kbd>
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new link</DialogTitle>
          <DialogDescription>
            Create a deep link for your project.
          </DialogDescription>
        </DialogHeader>

        <CreateLinkForm
          folders={folders}
          projectId={projectId}
          onCreated={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

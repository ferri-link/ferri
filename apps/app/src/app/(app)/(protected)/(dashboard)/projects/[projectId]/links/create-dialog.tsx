"use client";

import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";

export function CreateLinkDialog() {
  const [open, setOpen] = useState(false);

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

        <DialogFooter>
          <DialogClose render={<Button variant="outline" type="button" />}>
            Cancel
            <Kbd>Esc</Kbd>
          </DialogClose>
          <Button type="button">Create link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

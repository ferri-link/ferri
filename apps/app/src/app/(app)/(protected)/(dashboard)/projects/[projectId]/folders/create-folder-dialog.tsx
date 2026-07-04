"use client";

import { useForm } from "@tanstack/react-form";
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createFolder } from "@/lib/actions/project/create-folder";
import {
  FOLDER_DESCRIPTION_MAX_LENGTH,
  folderDescriptionSchema,
  folderNameSchema,
} from "@/lib/schema/folder";
import { blurValidator } from "@/lib/utils/form";

export function CreateFolderDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: "", description: "" },
  });

  function openChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setError(null);
      form.reset();
    }
  }

  // Press "c" to open the dialog. react-hotkeys-hook ignores keystrokes typed
  // in form fields by default, and it's disabled while the dialog is open.
  useHotkeys("c", () => setOpen(true), {
    enabled: !open,
    preventDefault: true,
  });

  // ⌘/Ctrl+Enter submits from anywhere in the open form (including the fields).
  useHotkeys("mod+enter", () => void save(), {
    enabled: open,
    enableOnFormTags: true,
    preventDefault: true,
  });

  async function save() {
    setError(null);
    const fieldErrors = [
      ...(await form.validateField("name", "submit")),
      ...(await form.validateField("description", "submit")),
    ];
    if (fieldErrors.length > 0) return;

    setPending(true);
    try {
      const result = await createFolder({
        projectId,
        name: form.getFieldValue("name"),
        description: form.getFieldValue("description"),
      });
      if (result?.serverError) {
        setError(result.serverError);
        return;
      }
      if (result?.validationErrors) {
        setError("Please check the form and try again.");
        return;
      }
      openChange(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogTrigger
        render={
          <Button>
            Create folder
            <Kbd>C</Kbd>
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new folder</DialogTitle>
          <DialogDescription>Use folders to organize links.</DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
          onKeyDown={(e) => {
            // Submitting is ⌘/Ctrl+Enter only; a bare Enter in a text input
            // shouldn't submit the form.
            if (
              e.key === "Enter" &&
              !e.metaKey &&
              !e.ctrlKey &&
              e.target instanceof HTMLInputElement
            ) {
              e.preventDefault();
            }
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              validators={{
                onBlur: blurValidator(folderNameSchema),
                onSubmit: folderNameSchema,
              }}
            >
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      autoFocus
                      placeholder="Marketing"
                      disabled={pending}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field
              name="description"
              validators={{
                onBlur: blurValidator(folderDescriptionSchema),
                onSubmit: folderDescriptionSchema,
              }}
            >
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center justify-between gap-2">
                      <FieldLabel htmlFor={field.name}>
                        Description
                        <span className="font-normal text-muted-foreground">
                          Optional
                        </span>
                      </FieldLabel>
                      <FieldDescription className="tabular-nums">
                        {field.state.value.length}/
                        {FOLDER_DESCRIPTION_MAX_LENGTH}
                      </FieldDescription>
                    </div>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      className="max-h-40"
                      placeholder="What goes in this folder?"
                      disabled={pending}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {error && <FieldError errors={[{ message: error }]} />}
          </FieldGroup>

          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" type="button" disabled={pending} />
              }
            >
              Cancel
              <Kbd>Esc</Kbd>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              <>
                {pending && <Spinner />}
                Create folder
                <Kbd>⌘ ⏎</Kbd>
              </>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

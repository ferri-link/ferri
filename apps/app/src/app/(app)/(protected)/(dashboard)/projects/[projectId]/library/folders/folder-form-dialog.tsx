"use client";

import { useForm } from "@tanstack/react-form";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";
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
import {
  FOLDER_DESCRIPTION_MAX_LENGTH,
  folderDescriptionSchema,
  folderNameSchema,
} from "@/lib/schema/folder";
import { blurValidator } from "@/lib/utils/form";

export type FolderFormValues = { name: string; description: string };

type SubmitResult =
  | { serverError?: string; validationErrors?: unknown }
  | undefined;

export function FolderFormDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  defaultValues,
  action,
  trigger,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  submitLabel: string;
  defaultValues: FolderFormValues;
  action: (values: FolderFormValues) => Promise<SubmitResult>;
  trigger?: ReactElement;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({ defaultValues });

  // Sync the fields to the latest values whenever the dialog opens — matters
  // for edit, where the folder may have changed since this component mounted.
  // Keyed on the primitive values (not the object) so an unrelated parent
  // re-render while typing doesn't wipe the fields.
  const { name: defaultName, description: defaultDescription } = defaultValues;
  useEffect(() => {
    if (open) {
      form.reset({ name: defaultName, description: defaultDescription });
    }
  }, [open, defaultName, defaultDescription, form]);

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      setError(null);
    }
  }

  // ⌘/Ctrl+Enter submits from anywhere in the open form (including the fields).
  useHotkeys("mod+enter", () => void save(), {
    enabled: open && !pending,
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
      const result = await action({
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
      onOpenChange(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger render={trigger} /> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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
                      autoComplete="off"
                      data-1p-ignore
                      data-lpignore="true"
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
                {submitLabel}
                <Kbd>⌘ ⏎</Kbd>
              </>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

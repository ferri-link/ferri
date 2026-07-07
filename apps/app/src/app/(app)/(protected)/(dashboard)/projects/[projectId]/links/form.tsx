"use client";

import type { FolderModel } from "@ferri/db";
import { useForm } from "@tanstack/react-form";
import { Dices } from "lucide-react";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LINK_DOMAINS,
  linkCodeSchema,
  linkDomainSchema,
  linkFolderSchema,
} from "@/lib/schema/link";
import { createLink } from "@/lib/actions/link/create-link";
import { generateLinkCode } from "@/lib/utils/link";
import { slugify } from "@/lib/utils/slug";

export function CreateLinkForm({
  folders,
  projectId,
  onCreated,
}: {
  folders: FolderModel[];
  projectId: string;
  onCreated: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default to the project's first folder (earliest created).
  const defaultFolderId =
    folders.length > 0
      ? folders.reduce((oldest, folder) =>
          folder.createdAt < oldest.createdAt ? folder : oldest,
        ).id
      : "";

  const form = useForm({
    defaultValues: {
      domain: LINK_DOMAINS[0],
      code: "",
      folderId: defaultFolderId,
    },
  });

  // Seed a random code on mount (client-only, to avoid a hydration mismatch)
  // so the field is never empty when the dialog opens.
  useEffect(() => {
    form.setFieldValue("code", generateLinkCode());
  }, [form]);

  // ⌘/Ctrl+Enter submits from anywhere in the form (the dialog mounts this only
  // while open, so no explicit open guard is needed).
  useHotkeys("mod+enter", () => void save(), {
    enabled: !pending,
    enableOnFormTags: true,
    preventDefault: true,
  });

  async function save() {
    setError(null);
    const fieldErrors = [
      ...(await form.validateField("domain", "submit")),
      ...(await form.validateField("code", "submit")),
      ...(await form.validateField("folderId", "submit")),
    ];
    if (fieldErrors.length > 0) return;

    setPending(true);
    try {
      const result = await createLink({
        projectId,
        domain: form.getFieldValue("domain"),
        code: form.getFieldValue("code"),
        folderId: form.getFieldValue("folderId"),
      });
      if (result?.serverError) {
        setError(result.serverError);
        return;
      }
      if (result?.validationErrors) {
        setError(
          result.validationErrors.code?._errors?.[0] ??
            result.validationErrors.folderId?._errors?.[0] ??
            "Please check the form and try again.",
        );
        return;
      }
      onCreated();
    } finally {
      setPending(false);
    }
  }

  return (
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
          name="code"
          validators={{ onBlur: linkCodeSchema, onSubmit: linkCodeSchema }}
        >
          {(codeField) => {
            const isInvalid = codeField.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel htmlFor={codeField.name}>Short Link</FieldLabel>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="-my-1.5"
                          disabled={pending}
                          aria-label="Generate a random code"
                          onClick={() =>
                            codeField.handleChange(generateLinkCode())
                          }
                        >
                          <Dices />
                        </Button>
                      }
                    />
                    <TooltipContent>Generate a random code</TooltipContent>
                  </Tooltip>
                </div>
                {/* Domain + code joined into one control that reads as a URL. */}
                <div className="flex h-9 items-center rounded-4xl border border-input bg-input/30 transition-colors focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-[3px] has-aria-invalid:ring-destructive/20">
                  <form.Field
                    name="domain"
                    validators={{
                      onBlur: linkDomainSchema,
                      onSubmit: linkDomainSchema,
                    }}
                  >
                    {(domainField) => (
                      <Select
                        value={domainField.state.value}
                        onValueChange={(value) => {
                          if (value) domainField.handleChange(value);
                        }}
                      >
                        <SelectTrigger
                          disabled={pending}
                          aria-invalid={
                            domainField.state.meta.errors.length > 0
                          }
                          className="h-9 rounded-4xl border-0 bg-transparent pr-1.5 focus-visible:border-transparent focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent dark:hover:bg-transparent"
                        >
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                        <SelectContent>
                          {LINK_DOMAINS.map((domain) => (
                            <SelectItem key={domain} value={domain}>
                              {domain}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </form.Field>
                  <span className="text-muted-foreground select-none">/</span>
                  <Input
                    id={codeField.name}
                    name={codeField.name}
                    autoFocus
                    placeholder="code"
                    disabled={pending}
                    value={codeField.state.value}
                    onChange={(e) =>
                      codeField.handleChange(slugify(e.target.value))
                    }
                    onBlur={() => {
                      // Never leave the code empty — fill it with a fresh one
                      // and skip blur validation so no "required" error flashes.
                      if (!codeField.state.value.trim()) {
                        codeField.handleChange(generateLinkCode());
                        return;
                      }
                      codeField.handleBlur();
                    }}
                    aria-invalid={isInvalid}
                    className="h-9 rounded-4xl border-0 bg-transparent pl-1.5 focus-visible:ring-0 aria-invalid:border-0 aria-invalid:ring-0"
                  />
                </div>
                {isInvalid && (
                  <FieldError errors={codeField.state.meta.errors} />
                )}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="folderId" validators={{ onSubmit: linkFolderSchema }}>
          {(field) => {
            const isInvalid = field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Folder</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => {
                    if (value) field.handleChange(value);
                  }}
                >
                  <SelectTrigger
                    id={field.name}
                    disabled={pending}
                    aria-invalid={isInvalid}
                    className="w-full"
                  >
                    {/* Map the id back to the folder name for display. */}
                    <SelectValue placeholder="Select folder">
                      {(value) =>
                        folders.find((folder) => folder.id === value)?.name
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        {error && <FieldError errors={[{ message: error }]} />}
      </FieldGroup>

      <DialogFooter>
        <DialogClose render={<Button variant="outline" type="button" />}>
          Cancel
          <Kbd>Esc</Kbd>
        </DialogClose>
        <Button type="submit" disabled={pending}>
          <>
            {pending && <Spinner />}
            Create link
            <Kbd>⌘ ⏎</Kbd>
          </>
        </Button>
      </DialogFooter>
    </form>
  );
}

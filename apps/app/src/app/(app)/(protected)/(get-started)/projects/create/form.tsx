"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createProject } from "@/lib/actions/project/create-project";
import { projectNameSchema, projectSlugSchema } from "@/lib/schema/project";
import { paths } from "@/lib/utils/paths";
import { slugify } from "@/lib/utils/slugify";

export function CreateProjectForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Once the user edits the slug, stop auto-filling it from the name.
  const slugEdited = useRef(false);

  const form = useForm({
    defaultValues: { name: "", slug: "" },
  });

  async function save() {
    setError(null);
    const fieldErrors = [
      ...(await form.validateField("name", "submit")),
      ...(await form.validateField("slug", "submit")),
    ];
    if (fieldErrors.length > 0) return;

    setPending(true);
    try {
      const result = await createProject({
        name: form.getFieldValue("name"),
        slug: form.getFieldValue("slug"),
      });
      if (result?.serverError) {
        setError(result.serverError);
        return;
      }
      if (result?.validationErrors) {
        setError(
          result.validationErrors.slug?._errors?.[0] ??
            "Please check the form and try again.",
        );
        return;
      }
      router.push(paths.index);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle>Create a project</CardTitle>
        <CardDescription>
          Give your project a name and a unique slug.
        </CardDescription>
      </CardHeader>

      <form
        className="flex flex-col gap-(--card-spacing)"
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <CardContent>
          <FieldGroup>
            <form.Field
              name="name"
              validators={{
                onBlur: projectNameSchema,
                onSubmit: projectNameSchema,
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
                      placeholder="My App"
                      disabled={pending}
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        if (!slugEdited.current) {
                          form.setFieldValue("slug", slugify(e.target.value));
                        }
                      }}
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
              name="slug"
              validators={{
                onBlur: projectSlugSchema,
                onSubmit: projectSlugSchema,
              }}
            >
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="my-app"
                      disabled={pending}
                      value={field.state.value}
                      onChange={(e) => {
                        slugEdited.current = true;
                        field.handleChange(slugify(e.target.value));
                      }}
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
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Creating…" : "Create project"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

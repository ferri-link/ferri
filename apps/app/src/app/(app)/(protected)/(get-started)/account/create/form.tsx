"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
import { createAccount } from "@/lib/actions/account/create-account";
import { displayNameSchema } from "@/lib/schema/account";
import { paths } from "@/lib/utils/paths";

export function CreateAccountForm({
  defaultName = "",
}: {
  defaultName?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { displayName: defaultName },
  });

  async function save() {
    setAuthError(null);
    const errors = await form.validateField("displayName", "submit");
    if (errors.length > 0) return;

    setPending(true);
    try {
      const result = await createAccount({
        displayName: form.getFieldValue("displayName"),
      });
      if (result?.serverError) {
        setAuthError(result.serverError);
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
        <CardTitle>What should we call you?</CardTitle>
        <CardDescription>
          Choose a display name for your Ferri account.
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
              name="displayName"
              validators={{ onBlur: displayNameSchema, onSubmit: displayNameSchema }}
            >
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Display name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      autoComplete="name"
                      autoFocus
                      placeholder="Oleh"
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

            {authError && <FieldError errors={[{ message: authError }]} />}
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Continue"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

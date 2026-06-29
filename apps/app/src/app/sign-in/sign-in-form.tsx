"use client";

import { useForm } from "@tanstack/react-form";
import { GalleryVerticalEnd } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Caption } from "@/components/ui/caption";
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
import { createClient } from "@/lib/supabase/client";

const emailSchema = z.email("Enter a valid email address.");
const pinSchema = z.string().length(6, "Enter the 6-digit code.");

export function SignInForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [pending, setPending] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "", pin: "" },
  });

  // Step 1: validate the email, then ask Supabase to email a one-time code.
  async function sendCode() {
    setAuthError(null);
    const errors = await form.validateField("email", "submit");
    if (errors.length > 0) return;

    setPending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: form.getFieldValue("email"),
        options: { shouldCreateUser: true },
      });
      if (error) {
        setAuthError(error.message);
        return;
      }
      form.setFieldValue("pin", "");
      setStep("otp");
    } finally {
      setPending(false);
    }
  }

  // Step 2: validate the code, then verify it with Supabase to sign in.
  async function verifyCode() {
    setAuthError(null);
    const errors = await form.validateField("pin", "submit");
    if (errors.length > 0) return;

    setPending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email: form.getFieldValue("email"),
        token: form.getFieldValue("pin"),
        type: "email",
      });
      if (error) {
        setAuthError(error.message);
        return;
      }
      router.push("/");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-center text-center">
        <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl">
          <GalleryVerticalEnd className="size-5" />
        </div>
        <CardTitle>Sign in to Ferri</CardTitle>
        <CardDescription>
          Welcome back! Please sign in to continue.
        </CardDescription>
      </CardHeader>

      <form
        className="flex flex-col gap-(--card-spacing)"
        onSubmit={(e) => {
          e.preventDefault();
          if (step === "email") {
            void sendCode();
          } else {
            void verifyCode();
          }
        }}
      >
        <CardContent>
          <FieldGroup>
            <form.Field
              name="email"
              validators={{ onBlur: emailSchema, onSubmit: emailSchema }}
            >
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      disabled={step === "otp" || pending}
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

            {step === "otp" && (
              <form.Field name="pin" validators={{ onSubmit: pinSchema }}>
                {(field) => {
                  const isInvalid = field.state.meta.errors.length > 0;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Code</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        autoFocus
                        maxLength={6}
                        placeholder="123456"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                        disabled={pending}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            )}
            {authError && <FieldError errors={[{ message: authError }]} />}
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-2">
          <Button type="submit" disabled={pending}>
            {step === "email"
              ? pending
                ? "Sending code…"
                : "Continue"
              : pending
                ? "Verifying…"
                : "Sign in"}
          </Button>
          <Caption className="text-center">
            If you don&apos;t yet have an account, it will be created
            automatically.
          </Caption>
        </CardFooter>
      </form>
    </Card>
  );
}

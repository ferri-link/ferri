import type * as z from "zod";

// A TanStack Form `onBlur` validator that validates against a zod schema but
// stays quiet while the field is still empty — so we don't nag the user for
// tabbing through an untouched input. Emptiness is left to `onSubmit`.
export function blurValidator(schema: z.ZodType<unknown, string>) {
  return ({ value }: { value: string }) =>
    value.trim() === "" ? undefined : schema.safeParse(value).error?.issues[0];
}

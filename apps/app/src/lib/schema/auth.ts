import * as z from "zod";

export const emailSchema = z.email("Enter a valid email address.");

export const codeSchema = z
  .string()
  .regex(/^\d{6}$/, "Enter the 6-digit code.");

export const signInSchema = z.object({ email: emailSchema });

export const verifySchema = z.object({ email: emailSchema, code: codeSchema });

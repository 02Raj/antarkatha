import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address."));

export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(72, "Password is too long.");

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  next: z.string().optional(),
});

export const signUpSchema = signInSchema.extend({
  displayName: z.string().trim().max(80).optional(),
});

export const magicLinkSchema = z.object({
  email: emailSchema,
  next: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const updatePasswordSchema = z.object({
  password: passwordSchema,
});

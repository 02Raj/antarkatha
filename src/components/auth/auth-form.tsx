"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/feedback";
import {
  sendMagicLink,
  sendPasswordReset,
  signInWithPassword,
  signUpWithPassword,
  startGoogleOAuthForm,
  updatePassword,
  type AuthState,
} from "@/app/(auth)/actions";

export type AuthMode = "login" | "signup" | "forgot" | "reset";

const empty: AuthState = {};

type AuthFormProps = {
  mode: AuthMode;
  nextPath?: string;
  configured: boolean;
  initialError?: string;
};

export function AuthForm({
  mode,
  nextPath = "/dashboard",
  configured,
  initialError,
}: AuthFormProps) {
  const [magic, setMagic] = React.useState(false);
  const [passwordState, passwordAction, passwordPending] = useActionState(
    mode === "signup" ? signUpWithPassword : signInWithPassword,
    empty,
  );
  const [magicState, magicAction, magicPending] = useActionState(sendMagicLink, empty);
  const [forgotState, forgotAction, forgotPending] = useActionState(sendPasswordReset, empty);
  const [resetState, resetAction, resetPending] = useActionState(updatePassword, empty);
  const [googleState, googleAction, googlePending] = useActionState(startGoogleOAuthForm, empty);

  const state =
    mode === "forgot"
      ? forgotState
      : mode === "reset"
        ? resetState
        : magic
          ? magicState
          : passwordState;
  const pending = passwordPending || magicPending || forgotPending || resetPending || googlePending;
  const error = initialError || state.error || googleState.error;
  const info = state.info;

  return (
    <div className="hairline w-full rounded-xl border bg-surface p-6 shadow-[0_1px_0_rgba(28,25,21,0.04)] sm:p-8">
      {!configured ? (
        <Notice tone="warning" title="Email sign-in is paused" className="mb-6">
          This instance has no Supabase keys yet. The form is here so the routes stay real; it will
          not create an account until local setup is complete.
        </Notice>
      ) : null}

      {error ? (
        <Notice tone="danger" className="mb-6">
          {error}
        </Notice>
      ) : null}
      {info ? (
        <Notice tone="success" className="mb-6">
          {info}
        </Notice>
      ) : null}

      {mode === "forgot" ? (
        <form action={forgotAction} className="space-y-4">
          <EmailField />
          <Button type="submit" className="w-full" disabled={pending || !configured}>
            {pending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      ) : mode === "reset" ? (
        <form action={resetAction} className="space-y-4">
          <PasswordField label="New password" autoComplete="new-password" />
          <Button type="submit" className="w-full" disabled={pending || !configured}>
            {pending ? "Saving…" : "Update password"}
          </Button>
        </form>
      ) : magic ? (
        <form action={magicAction} className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />
          <EmailField />
          <Button type="submit" className="w-full" disabled={pending || !configured}>
            {pending ? "Sending…" : "Email me a sign-in link"}
          </Button>
        </form>
      ) : (
        <form action={passwordAction} className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />
          {mode === "signup" ? (
            <Field id="displayName" label="What should we call you?" hint="Optional">
              {(aria) => <Input {...aria} name="displayName" autoComplete="name" />}
            </Field>
          ) : null}
          <EmailField />
          <PasswordField autoComplete={mode === "signup" ? "new-password" : "current-password"} />
          <Button type="submit" className="w-full" disabled={pending || !configured}>
            {pending ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </Button>
        </form>
      )}

      {mode === "login" || mode === "signup" ? (
        <div className="mt-4 space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={pending || !configured}
            onClick={() => setMagic((v) => !v)}
          >
            {magic ? "Use password instead" : "Use a magic link instead"}
          </Button>
          <form action={googleAction}>
            <input type="hidden" name="next" value={nextPath} />
            <Button
              type="submit"
              variant="quiet"
              className="w-full border border-copper/70"
              disabled={pending || !configured}
            >
              Continue with Google
            </Button>
          </form>
        </div>
      ) : null}

      <p className="mt-6 text-center text-sm text-ink-muted">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link href="/signup" className="link-quiet text-forest">
              Create an account
            </Link>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <Link href="/forgot-password" className="link-quiet text-forest">
              Forgot password
            </Link>
          </>
        ) : mode === "signup" ? (
          <>
            Already reading with us?{" "}
            <Link href="/login" className="link-quiet text-forest">
              Sign in
            </Link>
          </>
        ) : (
          <>
            Remembered it?{" "}
            <Link href="/login" className="link-quiet text-forest">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

function EmailField() {
  return (
    <Field id="email" label="Email" required>
      {(aria) => <Input {...aria} name="email" type="email" autoComplete="email" required />}
    </Field>
  );
}

function PasswordField({
  label = "Password",
  autoComplete = "current-password",
}: {
  label?: string;
  autoComplete?: string;
}) {
  return (
    <Field id="password" label={label} required hint="At least 8 characters">
      {(aria) => (
        <Input {...aria} name="password" type="password" autoComplete={autoComplete} required />
      )}
    </Field>
  );
}

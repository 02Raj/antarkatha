"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/feedback";
import { sendContact, type ContactState } from "@/app/(site)/contact/actions";

const empty: ContactState = {};

export function ContactForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(sendContact, empty);

  return (
    <form action={action} className="mt-8 space-y-4">
      {state.error ? <Notice tone="danger">{state.error}</Notice> : null}
      {state.info ? <Notice tone="success">{state.info}</Notice> : null}
      <Field id="email" label="Email" required>
        {(aria) => <Input {...aria} name="email" type="email" autoComplete="email" required />}
      </Field>
      <Field id="category" label="What is this about?" required>
        {(aria) => (
          <Select {...aria} name="category" defaultValue="general">
            <option value="general">A general note</option>
            <option value="content">Something in a lesson</option>
            <option value="technical">A technical problem</option>
            <option value="billing">Membership or billing</option>
          </Select>
        )}
      </Field>
      <Field id="message" label="Message" required hint="Please write at least a sentence.">
        {(aria) => <Textarea {...aria} name="message" required minLength={12} />}
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send to the desk"}
      </Button>
      <p className="text-sm text-ink-muted">
        You can also write directly to{" "}
        <a className="link-quiet text-forest" href={`mailto:${email}`}>
          {email}
        </a>
        .
      </p>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { saveReaderPreferences } from "@/lib/engagement/actions";
import type { ReaderPrefs } from "@/lib/engagement/queries";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/feedback";

export function PreferencesForm({ prefs }: { prefs: ReaderPrefs }) {
  const [state, action, pending] = useActionState(
    async (_prev: { info?: string; error?: string }, formData: FormData) => {
      return saveReaderPreferences({
        emailDaily: formData.get("emailDaily") === "on",
        audioSpeed: Number(formData.get("audioSpeed")),
        readerTheme: String(formData.get("readerTheme")) as ReaderPrefs["readerTheme"],
        fontFamily: String(formData.get("fontFamily")) as ReaderPrefs["fontFamily"],
        fontScale: Number(formData.get("fontScale")),
      });
    },
    {} as { info?: string; error?: string },
  );

  return (
    <form action={action} className="mt-8 space-y-4">
      {state.error ? <Notice tone="danger">{state.error}</Notice> : null}
      {state.info ? <Notice tone="success">{state.info}</Notice> : null}
      <Field id="fontScale" label="Reading size">
        {(aria) => (
          <Select {...aria} name="fontScale" defaultValue={String(prefs.fontScale)}>
            <option value="0.9">Smaller</option>
            <option value="1">Standard</option>
            <option value="1.15">Larger</option>
            <option value="1.3">Largest</option>
          </Select>
        )}
      </Field>
      <Field id="fontFamily" label="Type">
        {(aria) => (
          <Select {...aria} name="fontFamily" defaultValue={prefs.fontFamily}>
            <option value="serif">Serif</option>
            <option value="sans">Sans</option>
          </Select>
        )}
      </Field>
      <Field id="readerTheme" label="Page">
        {(aria) => (
          <Select {...aria} name="readerTheme" defaultValue={prefs.readerTheme}>
            <option value="sepia">Parchment</option>
            <option value="light">Paper white</option>
            <option value="dark">Night</option>
          </Select>
        )}
      </Field>
      <Field id="audioSpeed" label="Listening speed">
        {(aria) => (
          <Select {...aria} name="audioSpeed" defaultValue={String(prefs.audioSpeed)}>
            <option value="0.85">0.85×</option>
            <option value="1">1×</option>
            <option value="1.25">1.25×</option>
            <option value="1.5">1.5×</option>
          </Select>
        )}
      </Field>
      <label className="flex items-center gap-3 text-sm text-ink-soft">
        <input type="checkbox" name="emailDaily" defaultChecked={prefs.emailDaily} />
        Email me when the daily lesson changes
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save preferences"}
      </Button>
    </form>
  );
}

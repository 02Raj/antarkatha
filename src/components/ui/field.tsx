import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={cn("text-sm font-medium text-ink", className)} {...props} />;
}

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: (aria: {
    id: string;
    "aria-describedby"?: string;
    "aria-invalid"?: true;
    required?: boolean;
  }) => React.ReactNode;
};

/** Label + control + hint + error, wired with the right ARIA relationships. */
export function Field({ id, label, hint, error, required, className, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span className="text-saffron-ink" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </Label>
      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        required,
      })}
      {hint ? (
        <p id={hintId} className="text-[0.8125rem] text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-[0.8125rem] font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

"use client";

import { Toaster as Sonner } from "sonner";

export { toast } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "!rounded-lg !border !border-copper/60 !bg-surface !font-sans !text-ink !shadow-[0_16px_40px_-24px_rgb(28_25_21/0.5)]",
          description: "!text-ink-muted",
          actionButton: "!bg-forest !text-surface",
          error: "!border-danger/40",
        },
      }}
    />
  );
}

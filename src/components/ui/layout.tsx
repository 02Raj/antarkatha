import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentProps<"div"> & { width?: "content" | "reading" };

export function Container({ className, width = "content", ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        width === "content" ? "max-w-content" : "max-w-reading",
        className,
      )}
      {...props}
    />
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "start" | "center";
  className?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Tag = "h2",
  align = "start",
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <Tag
        id={id}
        className={cn(
          "text-ink",
          Tag === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-[2.5rem] sm:leading-[1.1]",
        )}
      >
        {title}
      </Tag>
      {description ? (
        <div className="mt-4 text-[1.0625rem] leading-relaxed text-ink-muted">{description}</div>
      ) : null}
    </div>
  );
}

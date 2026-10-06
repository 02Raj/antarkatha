import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StructuredContentRenderer } from "./structured-content-renderer";

describe("StructuredContentRenderer", () => {
  it("renders text and ignores injected html types", () => {
    render(
      <StructuredContentRenderer
        blocks={[
          { type: "paragraph", text: "Named as an adaptation." },
          { type: "html", html: "<img src=x onerror=alert(1)>" },
          { type: "heading", text: "Simple meaning", level: "h2" },
        ]}
      />,
    );
    expect(screen.getByText("Named as an adaptation.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Simple meaning" })).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

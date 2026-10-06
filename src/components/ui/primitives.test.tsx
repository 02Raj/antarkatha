import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Field } from "./field";
import { Input } from "./input";
import { StatusBadge } from "./badge";
import { splitBrand } from "@/components/brand/logo";

describe("Field", () => {
  it("links label, hint and error to the control", () => {
    render(
      <Field id="email" label="Email" hint="We never share it." error="Enter a valid email.">
        {(aria) => <Input {...aria} type="email" />}
      </Field>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("We never share it. Enter a valid email.");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email.");
  });

  it("omits aria-invalid when there is no error", () => {
    render(
      <Field id="n" label="Name">
        {(aria) => <Input {...aria} />}
      </Field>,
    );
    expect(screen.getByLabelText("Name")).not.toHaveAttribute("aria-invalid");
  });
});

describe("StatusBadge", () => {
  it("renders a readable label", () => {
    render(<StatusBadge status="source_review_pending" />);
    expect(screen.getByText("source review pending")).toBeInTheDocument();
  });
});

describe("splitBrand", () => {
  it("splits camel-cased brand names for the wordmark", () => {
    expect(splitBrand("AntarKatha")).toEqual({ first: "Antar", second: "Katha" });
    expect(splitBrand("Some Other Name")).toEqual({ first: "Some Other Name" });
  });
});

// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createPartialSet } from "../../../lib/ji/partialSet";
import { createPartial } from "../../../lib/ji/partial";
import { buildCalculatorResult } from "../../../lib/calculator/buildCalculatorResult";
import IntervalMatrixSection from "./IntervalMatrixSection";

describe("IntervalMatrixSection", () => {
  it("is collapsed by default and reveals both matrices when opened", () => {
    const partialSet = createPartialSet([
      createPartial(4n),
      createPartial(5n),
      createPartial(6n),
    ]);

    const result = buildCalculatorResult(partialSet);

    render(<IntervalMatrixSection result={result} />);

    const toggle = screen.getByRole("button", {
      name: "Show interval matrices",
    });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByText("Partial-set interval matrix"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Partial-class-set interval matrix"),
    ).not.toBeInTheDocument();

    fireEvent.click(toggle);

    expect(
      screen.getByRole("button", {
        name: "Hide interval matrices",
      }),
    ).toHaveAttribute("aria-expanded", "true");

    expect(
      screen.queryByText("Partial-set interval matrix"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Partial-class-set interval matrix"),
    ).toBeInTheDocument();
  });
});

// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Calculator from "./Calculator";

describe("Calculator", () => {
  it("calculates and displays results for a valid partial set", () => {
    const { container } = render(<Calculator />);

    fireEvent.change(screen.getByLabelText("Partial set"), {
      target: { value: "12, 15, 18" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    expect(container).toHaveTextContent("Set: {12, 15, 18}");
    expect(container).toHaveTextContent("Set class: [4, 5, 6]");
    expect(container).toHaveTextContent("Low inverse: {10, 12, 15}");
    expect(container).toHaveTextContent("Low-inverse set class: [10, 12, 15]");
  });

  it("shows validation feedback for invalid partial-set input", () => {
    render(<Calculator />);

    fireEvent.change(screen.getByLabelText("Partial set"), {
      target: { value: "4.5, 5, 6" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    expect(
      screen.getByText("Enter a valid set of positive integers."),
    ).toBeInTheDocument();
  });

  it("transposes a calculated set and displays the transposed sets", () => {
    const { container } = render(<Calculator />);

    fireEvent.change(screen.getByLabelText("Partial set"), {
      target: { value: "4, 5, 6" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));
    fireEvent.change(screen.getByLabelText("Transposition value"), {
      target: { value: "3" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Transpose" }));

    expect(container).toHaveTextContent("Partial set: {12, 15, 18}");
    expect(container).toHaveTextContent("Partial-class set: {3, 9, 15}");
  });

  it("clears transposed results when a new set is calculated", () => {
    const { container } = render(<Calculator />);

    fireEvent.change(screen.getByLabelText("Partial set"), {
      target: { value: "4, 5, 6" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));
    fireEvent.change(screen.getByLabelText("Transposition value"), {
      target: { value: "3" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Transpose" }));

    expect(container).toHaveTextContent("Partial set: {12, 15, 18}");

    fireEvent.change(screen.getByLabelText("Partial set"), {
      target: { value: "7, 8, 9" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    expect(container).not.toHaveTextContent("Partial set: {12, 15, 18}");
  });

  it("shows validation feedback for an invalid transposition value", () => {
    render(<Calculator />);

    fireEvent.change(screen.getByLabelText("Partial set"), {
      target: { value: "4, 5, 6" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));
    fireEvent.change(screen.getByLabelText("Transposition value"), {
      target: { value: "a" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Transpose" }));

    expect(
      screen.getByText("Enter a valid positive integer transposition value."),
    ).toBeInTheDocument();
  });
});

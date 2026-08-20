// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from "vitest";
import LatticeRatioControls from "./LatticeRatioControls";

describe("LatticeRatioControls", () => {
  it("submits a ratio input", () => {
    const onAdd = vi.fn();

    render(
      <LatticeRatioControls
        onAdd={onAdd}
        onUndo={vi.fn()}
        onReset={vi.fn()}
        inputError={null}
      />,
    );

    const input = screen.getByLabelText("Ratio");

    fireEvent.change(input, { target: { value: "3/2" } });
    fireEvent.click(screen.getByRole("button", { name: "Add ratio" }));

    expect(onAdd).toHaveBeenCalledWith("3/2");
  });

  it("calls undo", () => {
    const onUndo = vi.fn();

    render(
      <LatticeRatioControls
        onAdd={vi.fn()}
        onUndo={onUndo}
        onReset={vi.fn()}
        inputError={null}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Undo" }));

    expect(onUndo).toHaveBeenCalledOnce();
  });

  it("calls reset", () => {
    const onReset = vi.fn();

    render(
      <LatticeRatioControls
        onAdd={vi.fn()}
        onUndo={vi.fn()}
        onReset={onReset}
        inputError={null}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(onReset).toHaveBeenCalledOnce();
  });

  it("clears the input after successfully adding a ratio", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn(() => true);

    render(
      <LatticeRatioControls
        onAdd={onAdd}
        onUndo={vi.fn()}
        onReset={vi.fn()}
        inputError={null}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Ratio" });

    await user.type(input, "3/2");
    await user.click(screen.getByRole("button", { name: "Add ratio" }));

    expect(onAdd).toHaveBeenCalledWith("3/2");
    expect(input).toHaveValue("");
  });
});

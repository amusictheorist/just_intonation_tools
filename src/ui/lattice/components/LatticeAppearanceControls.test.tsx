// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LatticeAppearanceControls from "./LatticeAppearanceControls";

describe("LatticeAppearanceControls", () => {
  it("changes the higher-prime colour", () => {
    const onHigherPrimeColorChange = vi.fn();

    render(
      <LatticeAppearanceControls
        higherPrimeColor="#00008b"
        onHigherPrimeColorChange={onHigherPrimeColorChange}
      />,
    );

    fireEvent.change(screen.getByLabelText("Higher-prime color"), {
      target: { value: "#800080" },
    });

    expect(onHigherPrimeColorChange).toHaveBeenCalledWith("#800080");
  });
});

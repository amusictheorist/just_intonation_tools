// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LatticeVisualizationControls from "./LatticeVisualizationControls";

describe("LatticeVisualizationControls", () => {
  it("shows cubic visualization controls for cubic configuration", () => {
    render(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "cubic",
            includeHigherPrimes: false,
          },
          geometry: { type: "cubic" },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("radio", { name: "Cubic" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Radial" })).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Include higher primes" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "Include lower octave" }),
    ).not.toBeInTheDocument();
  });

  it("shows radial visualization controls for radial configuration", () => {
    render(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "radial",
            includeLowerOctave: false,
          },
          geometry: {
            type: "radial",
            includeGeneratorHeight: false,
            lowerSymmetry: "continuous",
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("checkbox", { name: "Include lower octave" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Include generator height" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Continuous" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Aligned" })).toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "Include higher primes" }),
    ).not.toBeInTheDocument();
  });

  it("changes the visualization type", () => {
    const onVisualizationTypeChange = vi.fn();

    render(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "cubic",
            includeHigherPrimes: false,
          },
          geometry: { type: "cubic" },
        }}
        onVisualizationTypeChange={onVisualizationTypeChange}
        onIncludeHigherPrimesChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    screen.getByRole("radio", { name: "Radial" }).click();
    expect(onVisualizationTypeChange).toHaveBeenCalledWith("radial");
  });

  it("changes whether higher primes are included", () => {
    const onIncludeHigherPrimesChange = vi.fn();

    render(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "cubic",
            includeHigherPrimes: false,
          },
          geometry: { type: "cubic" },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={onIncludeHigherPrimesChange}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    screen.getByRole("checkbox", { name: "Include higher primes" }).click();
    expect(onIncludeHigherPrimesChange).toHaveBeenCalledWith(true);
  });

  it("changes radial boolean options", () => {
    const onIncludeLowerOctaveChange = vi.fn();
    const onIncludeGeneratorHeightChange = vi.fn();

    render(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "radial",
            includeLowerOctave: false,
          },
          geometry: {
            type: "radial",
            includeGeneratorHeight: false,
            lowerSymmetry: "continuous",
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onIncludeLowerOctaveChange={onIncludeLowerOctaveChange}
        onIncludeGeneratorHeightChange={onIncludeGeneratorHeightChange}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    screen.getByRole("checkbox", { name: "Include lower octave" }).click();
    screen.getByRole("checkbox", { name: "Include generator height" }).click();
    expect(onIncludeLowerOctaveChange).toHaveBeenCalledWith(true);
    expect(onIncludeGeneratorHeightChange).toHaveBeenCalledWith(true);
  });

  it("changes lower-side radial symmetry", () => {
    const onLowerSymmetryChange = vi.fn();

    render(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "radial",
            includeLowerOctave: false,
          },
          geometry: {
            type: "radial",
            includeGeneratorHeight: false,
            lowerSymmetry: "continuous",
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={onLowerSymmetryChange}
      />,
    );

    screen.getByRole("radio", { name: "Aligned" }).click();
    expect(onLowerSymmetryChange).toHaveBeenCalledWith("aligned");
  });
});

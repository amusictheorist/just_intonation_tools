// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LatticeVisualizationControls from "./LatticeVisualizationControls";
import {
  DEFAULT_CUBIC_LOCAL_ROTATION,
  DEFAULT_HIGHER_PRIME_RADIUS,
} from "../../../lib/lattice/geometry/latticeGeometryConstants";

describe("LatticeVisualizationControls", () => {
  it("shows cubic visualization controls for cubic configuration", () => {
    render(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "cubic",
            includeHigherPrimes: false,
          },
          geometry: {
            type: "cubic",
            higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
            localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
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
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
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
          geometry: {
            type: "cubic",
            higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
            localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
          },
        }}
        onVisualizationTypeChange={onVisualizationTypeChange}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
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
          geometry: {
            type: "cubic",
            higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
            localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={onIncludeHigherPrimesChange}
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    screen.getByRole("checkbox", { name: "Include higher primes" }).click();
    expect(onIncludeHigherPrimesChange).toHaveBeenCalledWith(true);
  });

  it("shows higher-prime radius control when higher primes are enabled", () => {
    render(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "cubic",
            includeHigherPrimes: true,
          },
          geometry: {
            type: "cubic",
            higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
            localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("slider", { name: /Higher-prime radius/i }),
    ).toBeInTheDocument();
  });

  it("hides higher-prime radius control when higher primes are disabled", () => {
    render(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "cubic",
            includeHigherPrimes: false,
          },
          geometry: {
            type: "cubic",
            higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
            localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole("slider", { name: /Higher-prime radius/i }),
    ).not.toBeInTheDocument();
  });

  it("changes the higher-prime radius", () => {
    const onHigherPrimeRadiusChange = vi.fn();

    render(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "cubic",
            includeHigherPrimes: true,
          },
          geometry: {
            type: "cubic",
            higherPrimeRadius: 1,
            localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={onHigherPrimeRadiusChange}
        onLocalRotationChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    fireEvent.change(
      screen.getByRole("slider", { name: /Higher-prime radius/i }),
      { target: { value: "2.5" } },
    );

    expect(onHigherPrimeRadiusChange).toHaveBeenCalledWith(2.5);
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
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
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
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={onLowerSymmetryChange}
      />,
    );

    screen.getByRole("radio", { name: "Aligned" }).click();
    expect(onLowerSymmetryChange).toHaveBeenCalledWith("aligned");
  });

  it("shows local rotation controls when higher primes are enabled", () => {
    render(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "cubic",
            includeHigherPrimes: true,
          },
          geometry: {
            type: "cubic",
            higherPrimeRadius: 1,
            localRotation: {
              x: 0,
              y: 0,
              z: 0,
            },
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("slider", { name: /Rotate X:/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: /Rotate Y:/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: /Rotate Z:/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: /Master rotation/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: /Rotate XY/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: /Rotate YZ/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: /Rotate XZ/i }),
    ).toBeInTheDocument();
  });

  it("changes local cubic rotation", () => {
    const onLocalRotationChange = vi.fn();

    render(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "cubic",
            includeHigherPrimes: true,
          },
          geometry: {
            type: "cubic",
            higherPrimeRadius: 1,
            localRotation: {
              x: 10,
              y: 20,
              z: 30,
            },
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={onLocalRotationChange}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole("slider", { name: /Rotate X:/i }), {
      target: { value: "45" },
    });

    expect(onLocalRotationChange).toHaveBeenCalledWith({
      x: 45,
      y: 20,
      z: 30,
    });
  });

  it("combines coupled rotation controls into local cubic rotation", () => {
    const onLocalRotationChange = vi.fn();

    render(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "cubic",
            includeHigherPrimes: true,
          },
          geometry: {
            type: "cubic",
            higherPrimeRadius: 1,
            localRotation: {
              x: 0,
              y: 0,
              z: 0,
            },
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={onLocalRotationChange}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole("slider", { name: /Rotate XY/i }), {
      target: { value: "30" },
    });

    expect(onLocalRotationChange).toHaveBeenCalledWith({
      x: 30,
      y: 30,
      z: 0,
    });
  });

  it("applies master rotation to all three axes", () => {
    const onLocalRotationChange = vi.fn();

    render(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "cubic",
            includeHigherPrimes: true,
          },
          geometry: {
            type: "cubic",
            higherPrimeRadius: 1,
            localRotation: {
              x: 0,
              y: 0,
              z: 0,
            },
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={onLocalRotationChange}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole("slider", { name: /Master rotation/i }), {
      target: { value: "30" },
    });

    expect(onLocalRotationChange).toHaveBeenCalledWith({
      x: 30,
      y: 30,
      z: 30,
    });
  });

  it("resets local rotation controls when cubic configuration is reset", () => {
    const onLocalRotationChange = vi.fn();

    const { rerender } = render(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "cubic",
            includeHigherPrimes: true,
          },
          geometry: {
            type: "cubic",
            higherPrimeRadius: 1,
            localRotation: { x: 45, y: 0, z: 0 },
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={onLocalRotationChange}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("slider", { name: /Rotate X:/i })).toHaveValue(
      "45",
    );

    rerender(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "cubic",
            includeHigherPrimes: true,
          },
          geometry: {
            type: "cubic",
            higherPrimeRadius: 1,
            localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={onLocalRotationChange}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("slider", { name: /Rotate X:/i })).toHaveValue("0");
  });

  it("preserves coupled rotation controls when their combined rotation is reflected in configuration", () => {
    const onLocalRotationChange = vi.fn();

    const { rerender } = render(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "cubic",
            includeHigherPrimes: true,
          },
          geometry: {
            type: "cubic",
            higherPrimeRadius: 1,
            localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={onLocalRotationChange}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole("slider", { name: /Master rotation/i }), {
      target: { value: "30" },
    });

    rerender(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "cubic",
            includeHigherPrimes: true,
          },
          geometry: {
            type: "cubic",
            higherPrimeRadius: 1,
            localRotation: { x: 30, y: 30, z: 30 },
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={onLocalRotationChange}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("slider", { name: /Master rotation/i }),
    ).toHaveValue("30");
  });
});

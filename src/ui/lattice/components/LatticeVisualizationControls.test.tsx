// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LatticeVisualizationControls from "./LatticeVisualizationControls";
import {
  DEFAULT_CUBIC_LOCAL_ROTATION,
  DEFAULT_HIGHER_PRIME_RADIUS,
} from "../../../lib/lattice/geometry/latticeGeometryConstants";

function openHigherPrimePlacement(): void {
  fireEvent.click(screen.getByRole("button", { name: "Placement" }));
}

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
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("radio", { name: "Cubic" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Radial" })).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Include" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "Lower octave" }),
    ).not.toBeInTheDocument();
  });

  it("shows relevant radial visualization controls", () => {
    render(
      <LatticeVisualizationControls
        configuration={{
          visualization: {
            type: "radial",
            includeLowerOctave: false,
          },
          geometry: {
            type: "radial",
            includeGeneratorHeight: true,
            lowerSymmetry: "continuous",
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("checkbox", { name: "Lower octave" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Generator height" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("radio", { name: "Continuous" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("radio", { name: "Aligned" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "Higher primes" }),
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
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
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
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );
    screen.getByRole("checkbox", { name: "Include" }).click();
    expect(onIncludeHigherPrimesChange).toHaveBeenCalledWith(true);
  });

  it("shows higher-prime placement when higher primes are enabled", () => {
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
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Placement" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    openHigherPrimePlacement();

    expect(
      screen.getByRole("slider", { name: /Higher-prime radius/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Placement" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("hides higher-prime placement when higher primes are disabled", () => {
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
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Placement" }),
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
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );
    openHigherPrimePlacement();
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
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
        onIncludeLowerOctaveChange={onIncludeLowerOctaveChange}
        onIncludeGeneratorHeightChange={onIncludeGeneratorHeightChange}
        onLowerSymmetryChange={vi.fn()}
      />,
    );
    screen.getByRole("checkbox", { name: "Lower octave" }).click();
    screen.getByRole("checkbox", { name: "Generator height" }).click();
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
            includeLowerOctave: true,
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
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
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
            localRotation: { x: 0, y: 0, z: 0 },
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );
    openHigherPrimePlacement();
    expect(
      screen.getByRole("slider", { name: "Rotate X" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: "Rotate Y" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: "Rotate Z" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: "Master rotation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: "Rotate XY" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: "Rotate YZ" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: "Rotate XZ" }),
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
            localRotation: { x: 10, y: 20, z: 30 },
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
        onLocalRotationChange={onLocalRotationChange}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    openHigherPrimePlacement();

    fireEvent.change(screen.getByRole("slider", { name: "Rotate X" }), {
      target: { value: "45" },
    });

    expect(onLocalRotationChange).toHaveBeenCalledWith({ x: 45, y: 20, z: 30 });
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
            localRotation: { x: 0, y: 0, z: 0 },
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
        onLocalRotationChange={onLocalRotationChange}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    openHigherPrimePlacement();

    fireEvent.change(screen.getByRole("slider", { name: "Rotate XY" }), {
      target: { value: "30" },
    });

    expect(onLocalRotationChange).toHaveBeenCalledWith({ x: 30, y: 30, z: 0 });
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
            localRotation: { x: 0, y: 0, z: 0 },
          },
        }}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
        onLocalRotationChange={onLocalRotationChange}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    openHigherPrimePlacement();

    fireEvent.change(screen.getByRole("slider", { name: "Master rotation" }), {
      target: { value: "30" },
    });

    expect(onLocalRotationChange).toHaveBeenCalledWith({ x: 30, y: 30, z: 30 });
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
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
        onLocalRotationChange={onLocalRotationChange}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    openHigherPrimePlacement();

    expect(screen.getByRole("slider", { name: "Rotate X" })).toHaveValue("45");

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
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
        onLocalRotationChange={onLocalRotationChange}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("slider", { name: "Rotate X" })).toHaveValue("0");
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
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
        onLocalRotationChange={onLocalRotationChange}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    openHigherPrimePlacement();

    fireEvent.change(screen.getByRole("slider", { name: "Master rotation" }), {
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
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
        onLocalRotationChange={onLocalRotationChange}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("slider", { name: "Master rotation" })).toHaveValue(
      "30",
    );
  });

  it("changes the higher-prime color when higher primes are enabled", () => {
    const onHigherPrimeColorChange = vi.fn();

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
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={onHigherPrimeColorChange}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Color"), {
      target: { value: "#ff0000" },
    });

    expect(onHigherPrimeColorChange).toHaveBeenCalledWith("#ff0000");
  });

  it("hides the higher-prime color when higher primes are disabled", () => {
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
        higherPrimeColor="#000080"
        onHigherPrimeColorChange={vi.fn()}
        onVisualizationTypeChange={vi.fn()}
        onIncludeHigherPrimesChange={vi.fn()}
        onHigherPrimeRadiusChange={vi.fn()}
        onLocalRotationChange={vi.fn()}
        onIncludeLowerOctaveChange={vi.fn()}
        onIncludeGeneratorHeightChange={vi.fn()}
        onLowerSymmetryChange={vi.fn()}
      />,
    );

    expect(screen.queryByLabelText("Color")).not.toBeInTheDocument();
  });
});

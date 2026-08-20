// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import type { LatticeRatio } from "../../../lib/lattice/state/latticeRatio";
import { createTestRatio } from "../../../lib/ji/test/ratioTestHelpers";
import { act, renderHook } from "@testing-library/react";
import { useLatticePositioning } from "./useLatticePositioning";
import {
  DEFAULT_CUBIC_LOCAL_ROTATION,
  DEFAULT_HIGHER_PRIME_RADIUS,
} from "../../../lib/lattice/geometry/latticeGeometryConstants";

const ratios: readonly LatticeRatio[] = [
  {
    id: "ratio-1",
    rawInput: "3/2",
    ratio: createTestRatio(3n, 2n),
  },
];

describe("useLatticePositioning", () => {
  it("positions lattice ratios with the default configuration", () => {
    const { result } = renderHook(() => useLatticePositioning(ratios));

    expect(result.current.configuration).toEqual({
      visualization: {
        type: "cubic",
        includeHigherPrimes: false,
      },
      geometry: {
        type: "cubic",
        higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
        localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
      },
    });

    expect(result.current.positionedRatios).toHaveLength(1);
    expect(result.current.positionedRatios[0]?.latticeRatio).toBe(ratios[0]);
  });

  it("enables higher-prime cubic visualization", () => {
    const { result } = renderHook(() => useLatticePositioning(ratios));

    act(() => {
      result.current.setIncludeHigherPrimes(true);
    });

    expect(result.current.configuration).toEqual({
      visualization: {
        type: "cubic",
        includeHigherPrimes: true,
      },
      geometry: {
        type: "cubic",
        higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
        localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
      },
    });
  });

  it("switches to radial positioning", () => {
    const { result } = renderHook(() => useLatticePositioning(ratios));

    act(() => {
      result.current.setVisualizationType("radial");
    });

    expect(result.current.configuration).toEqual({
      visualization: {
        type: "radial",
        includeLowerOctave: false,
      },
      geometry: {
        type: "radial",
        includeGeneratorHeight: false,
        lowerSymmetry: "continuous",
      },
    });
  });

  it("enables lower-octave radial visualization", () => {
    const { result } = renderHook(() => useLatticePositioning(ratios));

    act(() => {
      result.current.setVisualizationType("radial");
    });

    act(() => {
      result.current.setIncludeLowerOctave(true);
    });

    expect(result.current.configuration).toEqual({
      visualization: {
        type: "radial",
        includeLowerOctave: true,
      },
      geometry: {
        type: "radial",
        includeGeneratorHeight: false,
        lowerSymmetry: "continuous",
      },
    });
  });

  it("enables radial generator height", () => {
    const { result } = renderHook(() => useLatticePositioning(ratios));

    act(() => {
      result.current.setVisualizationType("radial");
    });

    act(() => {
      result.current.setIncludeGeneratorHeight(true);
    });

    expect(result.current.configuration).toEqual({
      visualization: {
        type: "radial",
        includeLowerOctave: false,
      },
      geometry: {
        type: "radial",
        includeGeneratorHeight: true,
        lowerSymmetry: "continuous",
      },
    });
  });

  it("changes lower-side radial symmetry", () => {
    const { result } = renderHook(() => useLatticePositioning(ratios));

    act(() => {
      result.current.setVisualizationType("radial");
    });

    act(() => {
      result.current.setLowerSymmetry("aligned");
    });

    expect(result.current.configuration).toEqual({
      visualization: {
        type: "radial",
        includeLowerOctave: false,
      },
      geometry: {
        type: "radial",
        includeGeneratorHeight: false,
        lowerSymmetry: "aligned",
      },
    });
  });

  it("changes the higher-prime radius", () => {
    const { result } = renderHook(() => useLatticePositioning(ratios));

    act(() => {
      result.current.setHigherPrimeRadius(3);
    });

    expect(result.current.configuration).toEqual({
      visualization: {
        type: "cubic",
        includeHigherPrimes: false,
      },
      geometry: {
        type: "cubic",
        higherPrimeRadius: 3,
        localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
      },
    });
  });

  it("restores the default higher-prime radius when switching back to cubic", () => {
    const { result } = renderHook(() => useLatticePositioning(ratios));

    act(() => {
      result.current.setHigherPrimeRadius(3);
    });

    act(() => {
      result.current.setVisualizationType("radial");
    });

    act(() => {
      result.current.setVisualizationType("cubic");
    });

    expect(result.current.configuration).toEqual({
      visualization: {
        type: "cubic",
        includeHigherPrimes: false,
      },
      geometry: {
        type: "cubic",
        higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
        localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
      },
    });
  });

  it("changes the local cubic rotation", () => {
    const { result } = renderHook(() => useLatticePositioning(ratios));

    act(() => {
      result.current.setLocalRotation({ x: 10, y: 20, z: 30 });
    });

    expect(result.current.configuration).toEqual({
      visualization: {
        type: "cubic",
        includeHigherPrimes: false,
      },
      geometry: {
        type: "cubic",
        higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
        localRotation: { x: 10, y: 20, z: 30 },
      },
    });
  });
});

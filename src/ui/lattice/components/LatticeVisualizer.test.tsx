// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTestRatio } from "../../../lib/ji/test/ratioTestHelpers";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import type { LatticeSceneConnection } from "../../../lib/lattice/presentation/latticeSceneConnection";
import { useLatticePositioning } from "../hooks/useLatticePositioning";
import { useLatticeRatios } from "../hooks/useLatticeRatios";
import { useLatticeSceneData } from "../hooks/useLatticeSceneData";
import LatticeVisualizer from "./LatticeVisualizer";
import LatticeCanvas from "./LatticeCanvas";
import { act, render } from "@testing-library/react";
import type { PositionedLatticeRatio } from "../../../lib/lattice/state/createPositionedLatticeRatios";
import { DEFAULT_HIGHER_PRIME_POINT_COLOR } from "../../../lib/lattice/presentation/latticePointStyle";
import LatticeRatioControls from "./LatticeRatioControls";
import LatticeVisualizationControls from "./LatticeVisualizationControls";
import LatticeAppearanceControls from "./LatticeAppearanceControls";
import {
  DEFAULT_CUBIC_LOCAL_ROTATION,
  DEFAULT_HIGHER_PRIME_RADIUS,
} from "../../../lib/lattice/geometry/latticeGeometryConstants";

vi.mock("../hooks/useLatticeRatios", () => ({
  useLatticeRatios: vi.fn(),
}));

vi.mock("../hooks/useLatticePositioning", () => ({
  useLatticePositioning: vi.fn(),
}));

vi.mock("../hooks/useLatticeSceneData", () => ({
  useLatticeSceneData: vi.fn(),
}));

vi.mock("./LatticeRatioControls", () => ({
  default: vi.fn(() => null),
}));

vi.mock("./LatticeVisualizationControls", () => ({
  default: vi.fn(() => null),
}));

vi.mock("./LatticeAppearanceControls", () => ({
  default: vi.fn(() => null),
}));

vi.mock("./LatticeCanvas", () => ({
  default: vi.fn(() => null),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("LatticeVisualizer", () => {
  it("passes rebuilt lattice scene data to the canvas", () => {
    const ratio = {
      id: "ratio-1",
      rawInput: "3/2",
      ratio: createTestRatio(3n, 2n),
    };

    const positionedRatios: readonly PositionedLatticeRatio[] = [
      {
        latticeRatio: ratio,
        placement: {
          type: "cubic",
          placement: {
            type: "standard",
            coordinates: { x: 1, y: 0, z: 0 },
          },
        },
        position: { x: 1, y: 0, z: 0 },
      },
    ] as const;

    const scenePoints: readonly LatticeScenePoint[] = [
      {
        id: "ratio-1",
        rawInput: "3/2",
        ratio: ratio.ratio,
        labelRatio: ratio.ratio,
        position: { x: 1, y: 0, z: 0 },
        hasHigherPrimeFactors: false,
        radialSide: null,
      },
    ];

    const sceneConnections: readonly LatticeSceneConnection[] = [];

    vi.mocked(useLatticeRatios).mockReturnValue({
      ratios: [ratio],
      addRatio: vi.fn(),
      removeRatio: vi.fn(),
      reset: vi.fn(),
      undo: vi.fn(),
    });

    vi.mocked(useLatticePositioning).mockReturnValue({
      configuration: {
        visualization: {
          type: "cubic",
          includeHigherPrimes: false,
        },
        geometry: {
          type: "cubic",
          higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
          localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
        },
      },
      positionedRatios,
      setIncludeHigherPrimes: vi.fn(),
      setHigherPrimeRadius: vi.fn(),
      setLocalRotation: vi.fn(),
      setVisualizationType: vi.fn(),
      setIncludeLowerOctave: vi.fn(),
      setIncludeGeneratorHeight: vi.fn(),
      setLowerSymmetry: vi.fn(),
    });

    vi.mocked(useLatticeSceneData).mockReturnValue({
      scenePoints,
      sceneConnections,
    });

    render(<LatticeVisualizer />);

    expect(useLatticePositioning).toHaveBeenCalledWith([ratio]);
    expect(useLatticeSceneData).toHaveBeenCalledWith(positionedRatios);

    expect(LatticeCanvas).toHaveBeenCalledWith(
      expect.objectContaining({
        scenePoints,
        sceneConnections,
        higherPrimeColor: DEFAULT_HIGHER_PRIME_POINT_COLOR,
      }),
      undefined,
    );
  });

  it("passes ratio actions to the ratio controls", () => {
    const ratio = {
      id: "ratio-1",
      rawInput: "3/2",
      ratio: createTestRatio(3n, 2n),
    };

    const undo = vi.fn();
    const reset = vi.fn();

    vi.mocked(useLatticeRatios).mockReturnValue({
      ratios: [ratio],
      addRatio: vi.fn(),
      removeRatio: vi.fn(),
      undo,
      reset,
    });

    vi.mocked(useLatticePositioning).mockReturnValue({
      configuration: {
        visualization: {
          type: "cubic",
          includeHigherPrimes: false,
        },
        geometry: {
          type: "cubic",
          higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
          localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
        },
      },
      positionedRatios: [],
      setIncludeHigherPrimes: vi.fn(),
      setHigherPrimeRadius: vi.fn(),
      setLocalRotation: vi.fn(),
      setVisualizationType: vi.fn(),
      setIncludeLowerOctave: vi.fn(),
      setIncludeGeneratorHeight: vi.fn(),
      setLowerSymmetry: vi.fn(),
    });

    vi.mocked(useLatticeSceneData).mockReturnValue({
      scenePoints: [],
      sceneConnections: [],
    });

    render(<LatticeVisualizer />);

    expect(LatticeRatioControls).toHaveBeenCalledWith(
      expect.objectContaining({
        onUndo: undo,
        onReset: reset,
        inputError: null,
      }),
      undefined,
    );
  });

  it("adds a ratio from the ratio controls", () => {
    const addRatio = vi.fn(() => ({
      status: "added" as const,
      ratios: [],
    }));

    vi.mocked(useLatticeRatios).mockReturnValue({
      ratios: [],
      addRatio,
      removeRatio: vi.fn(),
      undo: vi.fn(),
      reset: vi.fn(),
    });

    vi.mocked(useLatticePositioning).mockReturnValue({
      configuration: {
        visualization: {
          type: "cubic",
          includeHigherPrimes: false,
        },
        geometry: {
          type: "cubic",
          higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
          localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
        },
      },
      positionedRatios: [],
      setIncludeHigherPrimes: vi.fn(),
      setHigherPrimeRadius: vi.fn(),
      setLocalRotation: vi.fn(),
      setVisualizationType: vi.fn(),
      setIncludeLowerOctave: vi.fn(),
      setIncludeGeneratorHeight: vi.fn(),
      setLowerSymmetry: vi.fn(),
    });

    vi.mocked(useLatticeSceneData).mockReturnValue({
      scenePoints: [],
      sceneConnections: [],
    });

    render(<LatticeVisualizer />);

    const props = vi.mocked(LatticeRatioControls).mock.calls[0]?.[0];

    if (!props) {
      throw new Error("Expected LatticeRatioControls to render");
    }

    act(() => {
      props.onAdd("3/2");
    });

    expect(addRatio).toHaveBeenCalledWith("3/2");
  });

  it("shows an invalid ratio error through the ratio controls", () => {
    const addRatio = vi.fn(() => ({
      status: "invalid" as const,
      ratios: [],
      error: "Enter a valid ratio",
    }));

    vi.mocked(useLatticeRatios).mockReturnValue({
      ratios: [],
      addRatio,
      removeRatio: vi.fn(),
      undo: vi.fn(),
      reset: vi.fn(),
    });

    vi.mocked(useLatticePositioning).mockReturnValue({
      configuration: {
        visualization: {
          type: "cubic",
          includeHigherPrimes: false,
        },
        geometry: {
          type: "cubic",
          higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
          localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
        },
      },
      positionedRatios: [],
      setIncludeHigherPrimes: vi.fn(),
      setHigherPrimeRadius: vi.fn(),
      setLocalRotation: vi.fn(),
      setVisualizationType: vi.fn(),
      setIncludeLowerOctave: vi.fn(),
      setIncludeGeneratorHeight: vi.fn(),
      setLowerSymmetry: vi.fn(),
    });

    vi.mocked(useLatticeSceneData).mockReturnValue({
      scenePoints: [],
      sceneConnections: [],
    });

    render(<LatticeVisualizer />);

    const initialProps = vi.mocked(LatticeRatioControls).mock.calls[0]?.[0];

    if (!initialProps) {
      throw new Error("Expected LatticeRatioControls to render");
    }

    act(() => {
      initialProps.onAdd("not-a-ratio");
    });

    const latestProps = vi.mocked(LatticeRatioControls).mock.lastCall?.[0];

    if (!latestProps) {
      throw new Error("Expected LatticeRatioControls to rerender");
    }

    expect(latestProps.inputError).toBe("Enter a valid ratio");
  });

  it("passes positioning state and actions to the visualization controls", () => {
    const configuration = {
      visualization: {
        type: "cubic" as const,
        includeHigherPrimes: false,
      },
      geometry: {
        type: "cubic" as const,
        higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
        localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
      },
    };

    const setIncludeHigherPrimes = vi.fn();
    const setHigherPrimeRadius = vi.fn();
    const setLocalRotation = vi.fn();
    const setVisualizationType = vi.fn();
    const setIncludeLowerOctave = vi.fn();
    const setIncludeGeneratorHeight = vi.fn();
    const setLowerSymmetry = vi.fn();

    vi.mocked(useLatticeRatios).mockReturnValue({
      ratios: [],
      addRatio: vi.fn(),
      removeRatio: vi.fn(),
      undo: vi.fn(),
      reset: vi.fn(),
    });

    vi.mocked(useLatticePositioning).mockReturnValue({
      configuration,
      positionedRatios: [],
      setIncludeHigherPrimes,
      setHigherPrimeRadius,
      setLocalRotation,
      setVisualizationType,
      setIncludeLowerOctave,
      setIncludeGeneratorHeight,
      setLowerSymmetry,
    });

    vi.mocked(useLatticeSceneData).mockReturnValue({
      scenePoints: [],
      sceneConnections: [],
    });

    render(<LatticeVisualizer />);

    expect(LatticeVisualizationControls).toHaveBeenCalledWith(
      expect.objectContaining({
        configuration,
        onVisualizationTypeChange: setVisualizationType,
        onIncludeHigherPrimesChange: setIncludeHigherPrimes,
        onLocalRotationChange: setLocalRotation,
        onIncludeLowerOctaveChange: setIncludeLowerOctave,
        onIncludeGeneratorHeightChange: setIncludeGeneratorHeight,
        onLowerSymmetryChange: setLowerSymmetry,
      }),
      undefined,
    );
  });

  it("passes higher-prime color state to the appearance controls", () => {
    vi.mocked(useLatticeRatios).mockReturnValue({
      ratios: [],
      addRatio: vi.fn(),
      removeRatio: vi.fn(),
      undo: vi.fn(),
      reset: vi.fn(),
    });

    vi.mocked(useLatticePositioning).mockReturnValue({
      configuration: {
        visualization: {
          type: "cubic",
          includeHigherPrimes: false,
        },
        geometry: {
          type: "cubic",
          higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
          localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
        },
      },
      positionedRatios: [],
      setIncludeHigherPrimes: vi.fn(),
      setHigherPrimeRadius: vi.fn(),
      setLocalRotation: vi.fn(),
      setVisualizationType: vi.fn(),
      setIncludeLowerOctave: vi.fn(),
      setIncludeGeneratorHeight: vi.fn(),
      setLowerSymmetry: vi.fn(),
    });

    vi.mocked(useLatticeSceneData).mockReturnValue({
      scenePoints: [],
      sceneConnections: [],
    });

    render(<LatticeVisualizer />);

    expect(LatticeAppearanceControls).toHaveBeenCalledWith(
      expect.objectContaining({
        higherPrimeColor: DEFAULT_HIGHER_PRIME_POINT_COLOR,
        onHigherPrimeColorChange: expect.any(Function),
      }),
      undefined,
    );
  });

  it("updates the canvas higher-prime color from the appearance controls", () => {
    vi.mocked(useLatticeRatios).mockReturnValue({
      ratios: [],
      addRatio: vi.fn(),
      removeRatio: vi.fn(),
      undo: vi.fn(),
      reset: vi.fn(),
    });

    vi.mocked(useLatticePositioning).mockReturnValue({
      configuration: {
        visualization: {
          type: "cubic",
          includeHigherPrimes: false,
        },
        geometry: {
          type: "cubic",
          higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
          localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
        },
      },
      positionedRatios: [],
      setIncludeHigherPrimes: vi.fn(),
      setHigherPrimeRadius: vi.fn(),
      setLocalRotation: vi.fn(),
      setVisualizationType: vi.fn(),
      setIncludeLowerOctave: vi.fn(),
      setIncludeGeneratorHeight: vi.fn(),
      setLowerSymmetry: vi.fn(),
    });

    vi.mocked(useLatticeSceneData).mockReturnValue({
      scenePoints: [],
      sceneConnections: [],
    });

    render(<LatticeVisualizer />);

    const appearanceProps = vi.mocked(LatticeAppearanceControls).mock
      .lastCall?.[0];

    if (!appearanceProps) {
      throw new Error("Expected LatticeAppearanceControls to render");
    }

    act(() => {
      appearanceProps.onHigherPrimeColorChange("#800080");
    });

    expect(LatticeCanvas).toHaveBeenLastCalledWith(
      expect.objectContaining({
        higherPrimeColor: "#800080",
      }),
      undefined,
    );
  });
});

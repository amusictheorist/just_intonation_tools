import { useCallback, useMemo, useState } from "react";
import { createPositionedLatticeRatios } from "../../../lib/lattice/state/createPositionedLatticeRatios";
import type { LatticePositioningConfiguration } from "../../../lib/lattice/state/latticePositioningConfiguration";
import type { LatticeRatio } from "../../../lib/lattice/state/latticeRatio";
import type {
  CubicLocalRotation,
  LowerRadialSymmetry,
} from "../../../lib/lattice/state/latticeGeometry";
import {
  DEFAULT_CUBIC_LOCAL_ROTATION,
  DEFAULT_HIGHER_PRIME_RADIUS,
} from "../../../lib/lattice/geometry/latticeGeometryConstants";

const DEFAULT_CONFIGURATION: LatticePositioningConfiguration = {
  visualization: {
    type: "cubic",
    includeHigherPrimes: false,
  },
  geometry: {
    type: "cubic",
    higherPrimeRadius: DEFAULT_HIGHER_PRIME_RADIUS,
    localRotation: DEFAULT_CUBIC_LOCAL_ROTATION,
  },
};

type UseLatticePositioningResult = {
  configuration: LatticePositioningConfiguration;
  positionedRatios: ReturnType<typeof createPositionedLatticeRatios>;
  setIncludeHigherPrimes: (includeHigherPrimes: boolean) => void;
  setHigherPrimeRadius: (higherPrimeRadius: number) => void;
  setLocalRotation: (rotation: CubicLocalRotation) => void;
  setVisualizationType: (type: "cubic" | "radial") => void;
  setIncludeLowerOctave: (includeLowerOctave: boolean) => void;
  setIncludeGeneratorHeight: (includeGeneratorHeight: boolean) => void;
  setLowerSymmetry: (lowerSymmetry: LowerRadialSymmetry) => void;
};

export function useLatticePositioning(
  ratios: readonly LatticeRatio[],
): UseLatticePositioningResult {
  const [configuration, setConfiguration] =
    useState<LatticePositioningConfiguration>(DEFAULT_CONFIGURATION);

  const positionedRatios = useMemo(
    () => createPositionedLatticeRatios(ratios, configuration),
    [ratios, configuration],
  );

  const setIncludeHigherPrimes = useCallback(
    (includeHigherPrimes: boolean): void => {
      setConfiguration((previous) => {
        if (previous.visualization.type !== "cubic") return previous;
        if (previous.geometry.type !== "cubic") return previous;

        return {
          visualization: {
            type: "cubic",
            includeHigherPrimes,
          },
          geometry: previous.geometry,
        };
      });
    },
    [],
  );

  const setHigherPrimeRadius = useCallback(
    (higherPrimeRadius: number): void => {
      setConfiguration((previous) => {
        if (previous.geometry.type !== "cubic") return previous;
        if (previous.visualization.type !== "cubic") return previous;

        return {
          visualization: previous.visualization,
          geometry: {
            ...previous.geometry,
            higherPrimeRadius,
          },
        };
      });
    },
    [],
  );

  const setLocalRotation = useCallback(
    (localRotation: CubicLocalRotation): void => {
      setConfiguration((previous) => {
        if (previous.visualization.type !== "cubic") return previous;
        if (previous.geometry.type !== "cubic") return previous;

        return {
          visualization: previous.visualization,
          geometry: {
            ...previous.geometry,
            localRotation,
          },
        };
      });
    },
    [],
  );

  const setVisualizationType = useCallback((type: "cubic" | "radial"): void => {
    if (type === "cubic") {
      setConfiguration({
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

      return;
    }

    setConfiguration({
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
  }, []);

  const setIncludeLowerOctave = useCallback(
    (includeLowerOctave: boolean): void => {
      setConfiguration((previous) => {
        if (previous.visualization.type !== "radial") return previous;
        if (previous.geometry.type !== "radial") return previous;

        return {
          visualization: {
            type: "radial",
            includeLowerOctave,
          },
          geometry: previous.geometry,
        };
      });
    },
    [],
  );

  const setIncludeGeneratorHeight = useCallback(
    (includeGeneratorHeight: boolean): void => {
      setConfiguration((previous) => {
        if (previous.visualization.type !== "radial") return previous;
        if (previous.geometry.type !== "radial") return previous;

        return {
          visualization: previous.visualization,
          geometry: {
            type: "radial",
            includeGeneratorHeight,
            lowerSymmetry: previous.geometry.lowerSymmetry,
          },
        };
      });
    },
    [],
  );

  const setLowerSymmetry = useCallback(
    (lowerSymmetry: LowerRadialSymmetry): void => {
      setConfiguration((previous) => {
        if (previous.visualization.type !== "radial") return previous;
        if (previous.geometry.type !== "radial") return previous;

        return {
          visualization: previous.visualization,
          geometry: {
            type: "radial",
            includeGeneratorHeight: previous.geometry.includeGeneratorHeight,
            lowerSymmetry,
          },
        };
      });
    },
    [],
  );

  return {
    configuration,
    positionedRatios,
    setIncludeHigherPrimes,
    setHigherPrimeRadius,
    setLocalRotation,
    setVisualizationType,
    setIncludeLowerOctave,
    setIncludeGeneratorHeight,
    setLowerSymmetry,
  };
}

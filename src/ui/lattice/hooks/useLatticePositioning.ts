import { useCallback, useMemo, useState } from "react";
import { createPositionedLatticeRatios } from "../../../lib/lattice/state/createPositionedLatticeRatios";
import {
  DEFAULT_CUBIC_POSITIONING_CONFIGURATION,
  DEFAULT_RADIAL_POSITIONING_CONFIGURATION,
  type LatticePositioningConfiguration,
} from "../../../lib/lattice/state/latticePositioningConfiguration";
import type { LatticeRatio } from "../../../lib/lattice/state/latticeRatio";
import type {
  CubicLocalRotation,
  LowerRadialSymmetry,
} from "../../../lib/lattice/state/latticeGeometry";

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

/**
 * Manages lattice visualization and geometry configuration and derives positioned ratios from the current ratio collection.
 *
 * @param ratios The lattice ratios to position with the current configuration.
 * @returns The current positioning configuration, positioned ratios, and family-specific configuration update functions.
 */

export function useLatticePositioning(
  ratios: readonly LatticeRatio[],
): UseLatticePositioningResult {
  const [configuration, setConfiguration] =
    useState<LatticePositioningConfiguration>(
      DEFAULT_CUBIC_POSITIONING_CONFIGURATION,
    );

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
      setConfiguration(DEFAULT_CUBIC_POSITIONING_CONFIGURATION);
      return;
    }

    setConfiguration(DEFAULT_RADIAL_POSITIONING_CONFIGURATION);
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

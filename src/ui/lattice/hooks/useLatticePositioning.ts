import { useCallback, useMemo, useState } from "react";
import { createPositionedLatticeRatios } from "../../../lib/lattice/state/createPositionedLatticeRatios";
import type { LatticePositioningConfiguration } from "../../../lib/lattice/state/latticePositioningConfiguration";
import type { LatticeRatio } from "../../../lib/lattice/state/latticeRatio";
import type { LowerRadialSymmetry } from "../../../lib/lattice/state/latticeGeometry";

const DEFAULT_CONFIGURATION: LatticePositioningConfiguration = {
  visualization: {
    type: "cubic",
    includeHigherPrimes: false,
  },
  geometry: { type: "cubic" },
};

type UseLatticePositioningResult = {
  configuration: LatticePositioningConfiguration;
  positionedRatios: ReturnType<typeof createPositionedLatticeRatios>;
  setIncludeHigherPrimes: (includeHigherPrimes: boolean) => void;
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
          geometry: { type: "cubic" },
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
        geometry: { type: "cubic" },
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
    setVisualizationType,
    setIncludeLowerOctave,
    setIncludeGeneratorHeight,
    setLowerSymmetry,
  };
}

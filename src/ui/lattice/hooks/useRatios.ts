import { useCallback, useState } from "react";
import { createRatio } from "../../../lib/lattice/math/parseRatio";
import { placeCubic } from "../../../lib/lattice/placement/cubic";
import type { PlacementMode, Ratio } from "../../../lib/lattice/types";

export const MODES = {
  CUBIC: "cubic",
  EXPANDED_CUBIC: "expanded_cubic",
  RADIAL: "radial",
  EXPANDED_RADIAL: "expanded_radial",
} as const satisfies Record<string, PlacementMode>;

type AddRatioResult =
  | {
      success: true;
      ratio: Ratio;
    }
  | {
      success: false;
      error: string;
    };

type UseRatiosResult = {
  ratios: Ratio[];
  addRatio: (input: string) => AddRatioResult;
  removeRatio: (id: string) => void;
  undo: () => void;
  reset: () => void;
  mode: PlacementMode;
  setMode: React.Dispatch<React.SetStateAction<PlacementMode>>;
};

export const useRatios = (initialRatios: Ratio[] = []): UseRatiosResult => {
  const [ratios, setRatios] = useState<Ratio[]>(initialRatios);

  const [, setHistory] = useState<Ratio[][]>([]);

  const [mode, setMode] = useState<PlacementMode>(MODES.CUBIC);

  const pushHistory = useCallback(() => {
    setHistory((previous) => [...previous, ratios]);
  }, [ratios]);

  const addRatio = useCallback(
    (input: string): AddRatioResult => {
      const result = createRatio(input);

      if (!result.valid) {
        return {
          success: false,
          error: result.error,
        };
      }

      if (mode === MODES.CUBIC && !placeCubic(result)) {
        return {
          success: false,
          error:
            "Cubic mode only allows 3-, 5-, and 7-limit ratios. Please switch to Expanded Cubic mode or one of the Radial modes for higher-limit ratios.",
        };
      }

      pushHistory();

      setRatios((previous) => [...previous, result]);

      return {
        success: true,
        ratio: result,
      };
    },
    [mode, pushHistory],
  );

  const removeRatio = useCallback(
    (id: string) => {
      pushHistory();

      setRatios((previous) => previous.filter((ratio) => ratio.id !== id));
    },
    [pushHistory],
  );

  const undo = useCallback(() => {
    setHistory((previous) => {
      if (previous.length === 0) {
        return previous;
      }

      const last = previous[previous.length - 1];

      setRatios(last);

      return previous.slice(0, -1);
    });
  }, []);

  const reset = useCallback(() => {
    pushHistory();
    setRatios([]);
  }, [pushHistory]);

  return {
    ratios,
    addRatio,
    removeRatio,
    undo,
    reset,
    mode,
    setMode,
  };
};

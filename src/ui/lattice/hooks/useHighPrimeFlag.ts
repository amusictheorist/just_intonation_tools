import { useMemo } from "react";
import type { Ratio } from "../../../lib/lattice/types";
import { factorRatio } from "../../../lib/lattice/math/factors";

export const useHighPrimeFlag = (ratios: Ratio[]): boolean => {
  return useMemo(
    () =>
      ratios.some((ratio) => {
        const factors = factorRatio(ratio);

        return [...factors.keys()].some((prime) => prime > 7);
      }),
    [ratios],
  );
};

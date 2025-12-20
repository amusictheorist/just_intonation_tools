import { useMemo } from "react";
import { factorRatio } from "../utils/math/helpers";

export const useHighPrimeFlag = ratios => {
  return useMemo(() => {
    return ratios.some(r => {
      const factors = factorRatio(r);
      return [...factors.keys()].some(p => p > 7);
    });
  }, [ratios]);
};
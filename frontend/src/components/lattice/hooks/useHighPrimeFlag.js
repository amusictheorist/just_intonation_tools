import { useMemo } from "react";
import { factorRatio } from "../placement/expandedCubic";

export const useHighPrimeFlag = ratios => {
  return useMemo(() => {
    return ratios.some(r => {
      const factors = factorRatio(r);
      return [...factors.keys()].some(p => p > 7);
    });
  }, [ratios]);
};
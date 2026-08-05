import { useMemo } from "react";
import type { LatticeControls, Rotation } from "../../../lib/lattice/types";

export const useControls = (
  radiusScale: number,
  combinedRotation: Rotation,
  primeColor: string,
): LatticeControls => {
  return useMemo(
    () => ({
      radiusScale,
      rotation: {
        rotX: combinedRotation.rotX,
        rotY: combinedRotation.rotY,
        rotZ: combinedRotation.rotZ,
      },
      primeColor,
    }),
    [
      radiusScale,
      combinedRotation.rotX,
      combinedRotation.rotY,
      combinedRotation.rotZ,
      primeColor,
    ],
  );
};

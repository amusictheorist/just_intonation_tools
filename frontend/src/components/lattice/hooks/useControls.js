import { useMemo } from "react";

export const useControls = (radiusScale, combinedRot, primeColor) => {
  return useMemo(() => ({
    radiusScale,
    rotation: {
      rotX: combinedRot.rotX,
      rotY: combinedRot.rotY,
      rotZ: combinedRot.rotZ
    },
    primeColor
  }), [radiusScale, combinedRot, primeColor]);
};
import { DEFAULT_SPIRAL_RADIUS, radiusAtTheta } from "../../../lib/spiral/math";
import type { SpiralPan, SpiralViewBox } from "../../../lib/spiral/types";

type UseSpiralViewBoxOptions = {
  maxTheta: number;
  zoom: number;
  pan: SpiralPan;
  radiusPerOctave?: number;
  padding?: number;
};

export const useSpiralViewBox = ({
  maxTheta,
  zoom,
  pan,
  radiusPerOctave = DEFAULT_SPIRAL_RADIUS,
  padding = 60,
}: UseSpiralViewBoxOptions): SpiralViewBox => {
  const maximumRadius = radiusAtTheta(maxTheta, radiusPerOctave);

  const baseExtent = Math.max(maximumRadius + padding, 120);

  const safeZoom = zoom > 0 ? zoom : 1;

  const extent = baseExtent / safeZoom;

  const viewBox = [
    -extent + pan.x,
    -extent + pan.y,
    extent * 2,
    extent * 2,
  ].join(" ");

  return {
    viewBox,
    extent,
    baseExtent,
  };
};

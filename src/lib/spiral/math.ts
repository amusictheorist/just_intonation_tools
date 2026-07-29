import type { Point2D } from "./types";

export const DEFAULT_SPIRAL_RADIUS = 30;

export const polarToXY = (radius: number, thetaDegrees: number): Point2D => {
  const thetaRadians = (-thetaDegrees + 90) * (Math.PI / 180);

  return {
    x: radius * Math.cos(thetaRadians),
    y: -radius * Math.sin(thetaRadians),
  };
};

export const radiusAtTheta = (
  thetaDegrees: number,
  radiusPerOctave = DEFAULT_SPIRAL_RADIUS,
): number => radiusPerOctave * (thetaDegrees / 360);

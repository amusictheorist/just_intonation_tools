import {
  DEFAULT_SPIRAL_RADIUS,
  polarToXY,
  radiusAtTheta,
} from "../../../lib/spiral/math";
import { SVG_NAMESPACE } from "./createSpiralDrawing";

const ANGLE_STEP = 1;
const ANIMATION_DURATION = 2000;

type DrawSpiralOptions = {
  pathElement: SVGPathElement;
  thetaStart: number;
  thetaEnd: number;
  animate?: boolean;
  radiusPerOctave?: number;
};

const appendPointToPath = (
  path: string,
  theta: number,
  radiusPerOctave: number,
): string => {
  const radius = radiusAtTheta(theta, radiusPerOctave);

  const { x, y } = polarToXY(radius, theta);

  return path === "" ? `M${x}, ${y}` : `${path}L${x},${y}`;
};

export const drawSpiral = ({
  pathElement,
  thetaStart,
  thetaEnd,
  animate = false,
  radiusPerOctave = DEFAULT_SPIRAL_RADIUS,
}: DrawSpiralOptions): number | null => {
  const existingPath = pathElement.getAttribute("d") ?? "";

  if (!animate) {
    let path = existingPath;

    for (let theta = thetaStart; theta <= thetaEnd; theta += ANGLE_STEP) {
      path = appendPointToPath(path, theta, radiusPerOctave);
    }

    pathElement.setAttribute("d", path);
    return null;
  }

  const totalAngle = thetaEnd - thetaStart;

  const startsWithMove = existingPath === "";

  let startTime: number | null = null;
  let animationFrameId: number | null = null;

  const extend = (timestamp: number) => {
    if (startTime === null) startTime = timestamp;

    const elapsed = timestamp - startTime;

    const linearProgress = Math.min(elapsed / ANIMATION_DURATION, 1);
    const easedProgress = 1 - (1 - linearProgress) ** 3;

    const currentTheta = thetaStart + totalAngle * easedProgress;

    let path = existingPath;
    let theta = thetaStart;

    if (startsWithMove) {
      path = appendPointToPath(path, theta, radiusPerOctave);
    } else {
      theta += ANGLE_STEP;
    }

    for (; theta <= currentTheta; theta += ANGLE_STEP) {
      path = appendPointToPath(path, theta, radiusPerOctave);
    }

    const lastWholeStep =
      Math.floor((currentTheta - thetaStart) / ANGLE_STEP) * ANGLE_STEP +
      thetaStart;

    if (currentTheta - lastWholeStep > 1e-6) {
      const radius = radiusAtTheta(currentTheta, radiusPerOctave);

      const { x, y } = polarToXY(radius, currentTheta);
      path += `L${x},${y}`;
    }

    pathElement.setAttribute("d", path);

    if (easedProgress < 1) animationFrameId = requestAnimationFrame(extend);
  };

  animationFrameId = requestAnimationFrame(extend);

  return animationFrameId;
};

type DrawOctaveLinesOptions = {
  groupElement: SVGElement;
  maxTheta: number;
  radiusPerOctave?: number;
};

export const drawOctaveLines = ({
  groupElement,
  maxTheta,
  radiusPerOctave = DEFAULT_SPIRAL_RADIUS,
}: DrawOctaveLinesOptions): void => {
  groupElement.querySelectorAll(".octave-line").forEach((element) => {
    element.remove();
  });

  const octaveCount = Math.floor(maxTheta / 360);

  for (let octave = 1; octave <= octaveCount; octave++) {
    const theta = 360 * octave;

    const radius = radiusAtTheta(theta, radiusPerOctave);

    const { x, y } = polarToXY(radius, theta);

    const line = document.createElementNS(SVG_NAMESPACE, "line");

    line.setAttribute("x1", "0");
    line.setAttribute("y1", "0");
    line.setAttribute("x2", x.toString());
    line.setAttribute("y2", y.toString());
    line.setAttribute("stroke", "blue");
    line.setAttribute("stroke-dasharray", "4,4");
    line.classList.add("octave-line");

    groupElement.append(line);
  }
};

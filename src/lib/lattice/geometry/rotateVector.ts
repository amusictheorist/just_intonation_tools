import type { CubicLocalRotation } from "../state/latticeGeometry";
import type { Vector3 } from "./createRadialDirectionVector";

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function rotateVector(
  vector: Vector3,
  rotation: CubicLocalRotation,
): Vector3 {
  const xRadians = degreesToRadians(rotation.x);
  const yRadians = degreesToRadians(rotation.y);
  const zRadians = degreesToRadians(rotation.z);

  const cosX = Math.cos(xRadians);
  const sinX = Math.sin(xRadians);
  const cosY = Math.cos(yRadians);
  const sinY = Math.sin(yRadians);
  const cosZ = Math.cos(zRadians);
  const sinZ = Math.sin(zRadians);

  const afterX = {
    x: vector.x,
    y: vector.y * cosX - vector.z * sinX,
    z: vector.y * sinX + vector.z * cosX,
  };

  const afterY = {
    x: afterX.x * cosY + afterX.z * sinY,
    y: afterX.y,
    z: -afterX.x * sinY + afterX.z * cosY,
  };

  return {
    x: afterY.x * cosZ - afterY.y * sinZ,
    y: afterY.x * sinZ + afterY.y * cosZ,
    z: afterY.z,
  };
}

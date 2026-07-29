import type { Rotation, Vector3 } from "../types";

export const vec = (x: number, y: number, z: number): Vector3 => ({
  x,
  y,
  z,
});

export const addScaled = (
  a: Vector3,
  b: Vector3,
  scaleAmount: number,
): Vector3 =>
  vec(
    a.x + b.x * scaleAmount,
    a.y + b.y * scaleAmount,
    a.z + b.z * scaleAmount,
  );

export const sub = (a: Vector3, b: Vector3): Vector3 =>
  vec(a.x - b.x, a.y - b.y, a.z - b.z);

export const dot = (a: Vector3, b: Vector3): number =>
  a.x * b.x + a.y * b.y + a.z * b.z;

export const cross = (a: Vector3, b: Vector3): Vector3 =>
  vec(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);

export const length = (vector: Vector3): number =>
  Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);

export const scale = (vector: Vector3, scaleAmount: number): Vector3 =>
  vec(vector.x * scaleAmount, vector.y * scaleAmount, vector.z * scaleAmount);

export const normalize = (vector: Vector3): Vector3 => {
  const vectorLength = length(vector);

  return vectorLength === 0
    ? vec(0, 0, 0)
    : vec(
        vector.x / vectorLength,
        vector.y / vectorLength,
        vector.z / vectorLength,
      );
};

const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180;

const rotateX = (vector: Vector3, angleDegrees: number): Vector3 => {
  const angle = degreesToRadians(angleDegrees);
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);

  return vec(
    vector.x,
    vector.y * cosine - vector.z * sine,
    vector.y * sine + vector.z * cosine,
  );
};

const rotateY = (vector: Vector3, angleDegrees: number): Vector3 => {
  const angle = degreesToRadians(angleDegrees);
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);

  return vec(
    vector.x * cosine + vector.z * sine,
    vector.y,
    -vector.x * sine + vector.z * cosine,
  );
};

const rotateZ = (vector: Vector3, angleDegrees: number): Vector3 => {
  const angle = degreesToRadians(angleDegrees);
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);

  return vec(
    vector.x * cosine - vector.y * sine,
    vector.x * sine + vector.y * cosine,
    vector.z,
  );
};

export const applyRotation = (
  vector: Vector3,
  rotation: Rotation = {},
): Vector3 => {
  const { rotX = 0, rotY = 0, rotZ = 0 } = rotation;

  let result = { ...vector };
  result = rotateY(result, rotY);
  result = rotateX(result, rotX);
  result = rotateZ(result, rotZ);

  return result;
};

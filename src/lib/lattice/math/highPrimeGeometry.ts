import type { PrimeFrame, Vector3 } from "../types";
import { BASE_RADIUS, GOLDEN_ANGLE } from "./constants";
import { N, PRIME_INDEX } from "./primes";
import { cross, dot, normalize, scale, vec } from "./vectors";

export const computePrimePosition = (
  prime: number,
  radiusScale = 1,
): Vector3 => {
  const index = PRIME_INDEX[prime];

  if (index === undefined) {
    throw new Error(`Prime ${prime} not found in PRIME_INDEX`);
  }

  const position = (index + 0.5) / N;
  const z = 1 - 2 * position;
  const radius = Math.sqrt(1 - z * z);
  const theta = index * GOLDEN_ANGLE;

  const base = vec(radius * Math.cos(theta), radius * Math.sin(theta), z);

  return scale(normalize(base), BASE_RADIUS * radiusScale);
};

const primeFrameCache = new Map<string, PrimeFrame>();

export const getPrimeFrame = (
  prime: number,
  radiusScale = 1,
  rotationAngle = 0,
  sign = 1,
): PrimeFrame => {
  const key = `${prime}_${radiusScale}_${rotationAngle}_${sign}`;
  const cached = primeFrameCache.get(key);

  if (cached) return cached;

  let origin = computePrimePosition(prime, radiusScale);

  if (sign < 0) origin = scale(origin, -1);

  const radial = normalize(origin);

  let up = vec(0, 1, 0);

  if (Math.abs(dot(radial, up)) > 0.9) up = vec(1, 0, 0);

  const Xp = normalize(cross(up, radial));
  const Yp = normalize(cross(radial, Xp));
  const Zp = radial;

  const frame = {
    origin,
    Xp,
    Yp,
    Zp,
  };

  primeFrameCache.set(key, frame);

  return frame;
};

const primeStepDirectionCache = new Map<string, Vector3>();

export const getPrimeStepDir = (prime: number, sign: number): Vector3 => {
  const key = `${prime}_${sign}`;
  const cached = primeStepDirectionCache.get(key);

  if (cached) return cached;

  let numerator: number;
  let denominator: number;

  if (sign > 0) {
    const exponent = Math.floor(Math.log2(prime));
    numerator = prime;
    denominator = 2 ** exponent;
  } else {
    const exponent = Math.ceil(Math.log2(prime));
    numerator = 2 ** exponent;
    denominator = prime;
  }

  const value = numerator / denominator;
  const angleDegrees = Math.log2(value) + 360;
  const angleRadians = (angleDegrees * Math.PI) / 180;

  const direction = normalize(
    vec(Math.sin(angleRadians), 0, -Math.cos(angleRadians)),
  );

  primeStepDirectionCache.set(key, direction);

  return direction;
};

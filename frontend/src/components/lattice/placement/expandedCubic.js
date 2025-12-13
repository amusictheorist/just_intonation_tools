import { place as placeCubic } from "./cubic";

// constants
const SPACING = 1;
const BASE_RADIUS = 1;
const SUB_PRIME_STEP = 0.5;
const MAX_PRIME = 127;

// prime indexing
const sieve = n => {
  const arr = Array(n + 1).fill(true);
  arr[0] = arr[1] = false;
  for (let i = 2; i * i <= n; i++) {
    if (arr[i]) {
      for (let j = i * i; j <= n; j += i) arr[j] = false;
    }
  }
  return arr.map((b, i) => b ? i : null).filter(x => x);
};

const ALL_PRIMES = sieve(MAX_PRIME);
const PRIME_INDEX = {};
ALL_PRIMES.forEach((p, i) => PRIME_INDEX[p] = i);

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const N = ALL_PRIMES.length;

// factoring functions
const factorInt = n => {
  const factors = new Map();
  let x = Math.abs(n);

  if (x === 0 || x === 1) return factors;

  let d = 2;
  while (d * d <= x) {
    while (x % d === 0) {
      factors.set(d, (factors.get(d) || 0) + 1);
      x = x / d;
    }
    d = d === 2 ? 3 : d + 2;
  }

  if (x > 1) {
    factors.set(x, (factors.get(x) || 0) + 1);
  }

  return factors;
};

const mergeFactors = (numFactors, denFactors) => {
  const result = new Map();

  for (const [p, e] of numFactors.entries()) {
    result.set(p, (result.get(p) || 0) + e);
  }
  for (const [p, e] of denFactors.entries()) {
    result.set(p, (result.get(p) || 0) - e);
  }

  result.delete(2);

  for (const [p, e] of result.entries()) {
    if (e === 0) result.delete(p);
  }

  return result;
};

export const factorRatio = ratio => {
  const { num, den } = ratio.canonical;
  const numFactors = factorInt(num);
  const denFactors = factorInt(den);

  return mergeFactors(numFactors, denFactors);
};

// vector math
const vec = (x, y, z) => {
  return { x, y, z };
};
const addScaled = (a, b, s) => vec(a.x + b.x * s, a.y + b.y * s, a.z + b.z * s);
const sub = (a, b) => vec(a.x - b.x, a.y - b.y, a.z - b.z);
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const cross = (a, b) =>
  vec(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  );

const length = v => Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
const scale = (v, s) => vec(v.x * s, v.y * s, v.z * s);

const normalize = v => {
  const len = length(v);
  return len === 0 ? vec(0, 0, 0) : vec(v.x / len, v.y / len, v.z / len);
};

// rotation helpers
const toRad = deg => (deg * Math.PI) / 180;

const rotateX = (v, angleDeg) => {
  const a = toRad(angleDeg);
  const c = Math.cos(a);
  const s = Math.sin(a);
  const y = v.y * c - v.z * s;
  const z = v.y * s + v.z * c;
  return vec(v.x, y, z);
};

const rotateY = (v, angleDeg) => {
  const a = toRad(angleDeg);
  const c = Math.cos(a);
  const s = Math.sin(a);
  const x = v.x * c + v.z * s;
  const z = -v.x * s + v.z * c;
  return vec(x, v.y, z);
};

const rotateZ = (v, angleDeg) => {
  const a = toRad(angleDeg);
  const c = Math.cos(a);
  const s = Math.sin(a);
  const x = v.x * c - v.y * s;
  const y = v.x * s + v.y * c;
  return vec(x, y, v.z);
};

const applyRotation = (v, rotation = {}) => {
  const { rotX = 0, rotY = 0, rotZ = 0 } = rotation;
  let out = { ...v };
  out = rotateY(out, rotY);
  out = rotateX(out, rotX);
  out = rotateZ(out, rotZ);
  return out;
};

// computing spherical prime positioning
const computePrimePosition = (p, radiusScale) => {
  if (radiusScale == null) radiusScale = 1;
  const idx = PRIME_INDEX[p];
  if (idx === undefined) throw new Error(`Prime ${p} not in PRIME_INDEX`);

  const t = (idx + 0.5) / N;
  const z = 1 - 2 * t;
  const r = Math.sqrt(1 - z * z);
  const theta = idx * GOLDEN_ANGLE;

  const base = vec(r * Math.cos(theta), r * Math.sin(theta), z);
  return scale(normalize(base), BASE_RADIUS * radiusScale);
};

const primeFrames = new Map();

const getPrimeFrame = (p, radiusScale, rotationAngle = 0, sign = +1) => {
  const key = `${p}_${radiusScale}+${rotationAngle}_${sign}`;
  if (primeFrames.has(key)) return primeFrames.get(key);

  let origin = computePrimePosition(p, radiusScale);

  if (sign < 0) origin = scale(origin, -1);

  const radial = normalize(origin);

  let up = vec(0, 1, 0);
  if (Math.abs(dot(radial, up)) > 0.9) up = vec(1, 0, 0);

  let Xp = normalize(cross(up, radial));
  let Yp = normalize(cross(radial, Xp));
  const Zp = radial;

  const frame = { origin, Xp, Yp, Zp };
  primeFrames.set(key, frame);
  return frame;
};

// main sphere placement
export const placeExpanded = (ratio, controls = {}) => {
  const { radiusScale = 1, rotation = {} } = controls;
  const factors = factorRatio(ratio);

  const a = factors.get(3) || 0;
  const b = factors.get(5) || 0;
  const c = factors.get(7) || 0;

  const highPrimes = [...factors.entries()].filter(([p, e]) => p > 7 && e !== 0);

  if (highPrimes.length === 0) {
    const base = placeCubic(ratio);
    if (!base) return null;

    return {
      x: base.x,
      y: base.y,
      z: base.z,
      lattice: base.lattice || [base.x, base.y, base.z],
      latticeType: 'global',
      primeAnchor: null
    };
  }

  const anchor = highPrimes.reduce((m, c) => (c[0] > m[0] ? c : m));
  const [anchorPrime, anchorExp] = anchor;
  const sign = anchorExp > 0 ? +1 : -1;

  const frame = getPrimeFrame(anchorPrime, radiusScale, 0, sign);

  let pos = { ...frame.origin };

  if (a !== 0) pos = addScaled(pos, frame.Xp, a * SPACING);
  if (b !== 0) pos = addScaled(pos, frame.Yp, b * SPACING);
  if (c !== 0) pos = addScaled(pos, frame.Zp, c * SPACING);

  for (const [p, e] of highPrimes) {
    if (p === anchorPrime) continue;

    const otherOrigin = scale(computePrimePosition(p, radiusScale), e > 0 ? +1 : -1);
    const dir = normalize(sub(otherOrigin, frame.origin));
    pos = addScaled(pos, dir, Math.abs(e) * SUB_PRIME_STEP);
  }

  let finalPos = pos;
  if (highPrimes.length > 0) {
    finalPos = applyRotation(pos, rotation);
  }

  return {
    x: finalPos.x,
    y: finalPos.y,
    z: finalPos.z,
    lattice: [a, b, c],
    latticeType: 'prime',
    primeAnchor: anchorPrime
  }
};
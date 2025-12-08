import { place as placeCubic } from "./cubic";

const SPACING = 2;
const BASE_RADIUS = 2;
const SUB_PRIME_STEP = SPACING;

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

  if (result.has(2)) result.delete(2);

  for (const [p, e] of result.entries()) {
    if (e === 0) result.delete(p);
  }

  return result;
};

const factorRatio = ratio => {
  const { num, den } = ratio.canonical;
  const numFactors = factorInt(num);
  const denFactors = factorInt(den);

  return mergeFactors(numFactors, denFactors);
};

const vec = (x, y, z) => {
  return { x, y, z };
};
const add = (a, b) => vec(a.x + b.x, a.y + b.y, a.z + b.z);
const addScaled = (a, b, s) => vec(a.x + b.x * s, a.y + b.y * s, a.z + b.z * s);
const sub = (a, b) => vec(a.x - b.x, a.y - b.y, a.z - b.z);
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const cross = (a, b) => vec(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
const length = v => Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
const scale = (v, s) => vec(v.x * s, v.y * s, v.z * s);

const normalize = v => {
  const len = length(v);
  if (len === 0) return vec(0, 0, 0);
  return vec(v.x / len, v.y / len, v.z / len);
};

const primeIndex = new Map();

const getPrimeIndex = p => {
  if (!primeIndex.has(p)) {
    primeIndex.set(p, primeIndex.size);
  }
  return primeIndex.get(p);
};

const primeFrames = new Map();

const computePrimePosition = p => {
  const k = getPrimeIndex(p);
  const N = 64;
  const golden = (1 + Math.sqrt(5)) / 2;
  const t = (k + 0.5) / N;
  const z = 1 - 2 * t;
  const r = Math.sqrt(1 - z * z);
  const theta = 2 * Math.PI * k / golden;

  const x = r * Math.cos(theta);
  const y = r * Math.sin(theta);

  const base = vec(x, y, z);

  const rad = BASE_RADIUS;
  return scale(normalize(base), rad);
};

const getPrimeFrame = p => {
  if (primeFrames.has(p)) return primeFrames.get(p);

  const origin = computePrimePosition(p);
  const radial = normalize(origin);

  let up = vec(0, 1, 0);
  if (Math.abs(dot(radial, up)) > 0.9) {
    up = vec(1, 0, 0);
  }

  const Xp = normalize(cross(up, radial));
  const Yp = normalize(cross(radial, Xp));
  const Zp = radial;

  const frame = { origin, Xp, Yp, Zp };
  primeFrames.set(p, frame);
  return frame;
};

export const placeExpanded = ratio => {
  const factors = factorRatio(ratio);

  const a = factors.get(3) || 0;
  const b = factors.get(5) || 0;
  const c = factors.get(7) || 0;

  const highPrimes = [];
  for (const [p, e] of factors.entries()) {
    if (p > 7 && e !== 0) {
      highPrimes.push({ p, e });
    }
  }

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

  const anchorEntry = highPrimes.reduce((min, cur) =>
    cur.p < min.p ? cur : min
  );
  const anchorPrime = anchorEntry.p;

  const frame = getPrimeFrame(anchorPrime);
  let pos = { ...frame.origin };

  if (a !== 0) pos = addScaled(pos, frame.Xp, a * SPACING);
  if (b !== 0) pos = addScaled(pos, frame.Yp, b * SPACING);
  if (c !== 0) pos = addScaled(pos, frame.Zp, c * SPACING);

  for (const entry of highPrimes) {
    if (entry.p === anchorPrime) continue;

    const p = entry.p;
    const e = entry.e;

    const otherFrame = getPrimeFrame(p);
    const dir = normalize(sub(otherFrame.origin, frame.origin));
    pos = addScaled(pos, dir, e * SUB_PRIME_STEP);
  }

  const lattice = [a, b, c];

  return {
    x: pos.x,
    y: pos.y,
    z: pos.z,
    lattice,
    latticeType: 'prime',
    primeAnchor: anchorPrime
  }
};
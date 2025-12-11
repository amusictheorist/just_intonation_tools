import { place as placeCubic } from "./cubic";

const SPACING = 1;
const BASE_RADIUS = 1.5;
const SUB_PRIME_STEP = SPACING;
const MAX_PRIME = 127;

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

const primeFrames = new Map();

const computePrimePosition = p => {
  const idx = PRIME_INDEX[p];
  if (idx === undefined) throw new Error(`Prime ${p} not in PRIME_INDEX`);

  const t = (idx + 0.5) / N;
  const z = 1 - 2 * t;
  const r = Math.sqrt(1 - z * z);
  const theta = idx * GOLDEN_ANGLE;

  const x = r * Math.cos(theta);
  const y = r * Math.sin(theta);

  return scale(normalize(vec(x,y,z)), BASE_RADIUS);
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
  const anchorExp = anchorEntry.e;

  const baseOrigin = computePrimePosition(anchorPrime);
  const origin = anchorExp > 0 ? baseOrigin : scale(baseOrigin, -1);
  const baseFrame = getPrimeFrame(anchorPrime);

  let Xp = baseFrame.Xp;
  let Yp = baseFrame.Yp;
  let Zp = baseFrame.Zp;

  if (anchorExp < 0) {
    Zp = scale(Zp, -1);
    Yp = scale(Yp, -1);
  }

  let pos = { ...origin };

  if (a !== 0) pos = addScaled(pos, Xp, a * SPACING);
  if (b !== 0) pos = addScaled(pos, Yp, b * SPACING);
  if (c !== 0) pos = addScaled(pos, Zp, c * SPACING);

  for (const entry of highPrimes) {
    if (entry.p === anchorPrime) continue;

    const p = entry.p;
    const e = entry.e;

    const otherBase = computePrimePosition(p);
    const otherOrigin = e > 0 ? otherBase : scale(otherBase, -1);
    const dir = normalize(sub(otherOrigin, origin));
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
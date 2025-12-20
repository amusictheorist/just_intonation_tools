const gcd = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
};

export const reduceFraction = (num, den) => {
  const g = gcd(num, den);
  return { num: num / g, den: den / g };
};

export const octaveReduce = (n0, d0) => {
  if (d0 === 0) throw new Error('Denominator cannot be zero');

  let num = Math.trunc(n0);
  let den = Math.trunc(d0);

  if (num === 0) return { num: 0, den: 1, value: 0 };

  const sign = (num < 0) !== (den < 0) ? -1 : 1;
  num = Math.abs(num);
  den = Math.abs(den);
  ({ num, den } = reduceFraction(num, den));

  while (num / den >= 2) {
    if (num % 2 === 0) {
      num /= 2;
    } else {
      den *= 2;
    }
    ({ num, den} = reduceFraction(num, den));
  }

  while (num / den < 1) {
    if (den % 2 === 0) {
      den /= 2;
    } else {
      num *= 2;
    }
    ({ num, den } = reduceFraction(num, den));
  }

  ({ num, den } = reduceFraction(num, den));

  if (sign === -1) num = -num;

  return { num, den, value: num / den };
};

export const rationalApproximation = (x, maxDen = 1000) => {
  if (!isFinite(x)) return null;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  if (x === 0) return { num: 0, den: 1 };

  let a0 = Math.floor(x);
  if (Math.abs(a0 - x) < 1e-12) return { num: sign * a0, den: 1 };

  let h1 = 1, k1 = 0;
  let h0 = a0, k0 = 1;
  let frac = x - a0;

  while (true) {
    if (frac === 0) break;

    const a = Math.floor(1 / frac);
    frac = 1 / frac - a;

    const h = a * h0 + h1;
    const k = a * k0 + k1;

    if (k > maxDen) break;

    h1 = h0;
    k1 = k0;
    h0 = h;
    k0 = k;
  }

  return { num: sign * h0, den: k0 };
};

export const sieve = n => {
  const arr = Array(n + 1).fill(true);
  arr[0] = arr[1] = false;
  for (let i = 2; i * i <= n; i++) {
    if (arr[i]) {
      for (let j = i * i; j <= n; j += i) arr[j] = false;
    }
  }
  return arr.map((b, i) => b ? i : null).filter(x => x);
};

// vector math
export const vec = (x, y, z) => {
  return { x, y, z };
};
export const addScaled = (a, b, s) => vec(a.x + b.x * s, a.y + b.y * s, a.z + b.z * s);
export const sub = (a, b) => vec(a.x - b.x, a.y - b.y, a.z - b.z);
export const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
export const cross = (a, b) =>
  vec(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  );

export const length = v => Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
export const scale = (v, s) => vec(v.x * s, v.y * s, v.z * s);

export const normalize = v => {
  const len = length(v);
  return len === 0 ? vec(0, 0, 0) : vec(v.x / len, v.y / len, v.z / len);
};

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

export const factor357 = n => {
  let a = 0, b = 0, c = 0;

  while (n % 2 === 0) { n /= 2 };
  while (n % 3 === 0) { n /= 3; a++; };
  while (n % 5 === 0) { n /= 5; b++; };
  while (n % 7 === 0) { n /= 7; c++; };

  return { leftover: n, a, b, c };
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

export const applyRotation = (v, rotation = {}) => {
  const { rotX = 0, rotY = 0, rotZ = 0 } = rotation;
  let out = { ...v };
  out = rotateY(out, rotY);
  out = rotateX(out, rotX);
  out = rotateZ(out, rotZ);
  return out;
};

export const normalizeBelowOne = (num, den) => {
  while (num / den < 0.5) {
    num *= 2;
  }
  return { num, den };
};
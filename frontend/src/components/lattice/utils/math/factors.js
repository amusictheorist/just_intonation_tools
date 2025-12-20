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

export const normalizeBelowOne = (num, den) => {
  while (num / den < 0.5) {
    num *= 2;
  }
  return { num, den };
};
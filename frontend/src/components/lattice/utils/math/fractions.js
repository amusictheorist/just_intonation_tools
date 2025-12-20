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
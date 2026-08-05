import type { Fraction, FractionWithValue } from "../types";

const gcd = (a: number, b: number): number => {
  let left = Math.abs(a);
  let right = Math.abs(b);

  while (right !== 0) {
    const remainder = left % right;
    left = right;
    right = remainder;
  }

  return left;
};

export const reduceFraction = (
  numerator: number,
  denominator: number,
): Fraction => {
  if (denominator === 0) {
    throw new Error("Denominator cannot be zero");
  }

  const divisor = gcd(numerator, denominator);

  return {
    num: numerator / divisor,
    den: denominator / divisor,
  };
};

export const octaveReduce = (
  initialNumerator: number,
  initialDenominator: number,
): FractionWithValue => {
  if (initialDenominator === 0) {
    throw new Error("Denominator cannot be zero");
  }

  let num = Math.trunc(initialNumerator);
  let den = Math.trunc(initialDenominator);

  if (num === 0) {
    return {
      num: 0,
      den: 1,
      value: 0,
    };
  }

  const sign = num < 0 !== den < 0 ? -1 : 1;

  num = Math.abs(num);
  den = Math.abs(den);

  ({ num, den } = reduceFraction(num, den));

  while (num / den >= 2) {
    if (num % 2 === 0) {
      num /= 2;
    } else {
      den *= 2;
    }

    ({ num, den } = reduceFraction(num, den));
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

  if (sign === -1) {
    num = -num;
  }

  return {
    num,
    den,
    value: num / den,
  };
};

export const rationalApproximation = (
  input: number,
  maxDenominator = 1000,
): Fraction | null => {
  if (!Number.isFinite(input)) return null;

  const sign = input < 0 ? -1 : 1;
  const value = Math.abs(input);

  if (value === 0) {
    return {
      num: 0,
      den: 1,
    };
  }

  const integerPart = Math.floor(value);

  if (Math.abs(integerPart - value) < 1e-12) {
    return {
      num: sign * integerPart,
      den: 1,
    };
  }

  let previousNumerator = 1;
  let previousDenominator = 0;
  let numerator = integerPart;
  let denominator = 1;
  let fractionalPart = value - integerPart;

  while (fractionalPart !== 0) {
    const coefficient = Math.floor(1 / fractionalPart);
    fractionalPart = 1 / fractionalPart - coefficient;

    const nextNumerator = coefficient * numerator + previousNumerator;
    const nextDenominator = coefficient * denominator + previousDenominator;

    if (nextDenominator > maxDenominator) break;

    previousNumerator = numerator;
    previousDenominator = denominator;
    numerator = nextNumerator;
    denominator = nextDenominator;
  }

  return {
    num: sign * numerator,
    den: denominator,
  };
};

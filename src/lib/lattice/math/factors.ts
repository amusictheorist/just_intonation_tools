import type { Ratio } from "../types";

export type PrimeFactors = Map<number, number>;

export type Factors357 = {
  leftover: number;
  a: number;
  b: number;
  c: number;
};

const factorInteger = (input: number): PrimeFactors => {
  const factors: PrimeFactors = new Map();
  let value = Math.abs(input);

  if (value === 0 || value === 1) return factors;

  let divisor = 2;

  while (divisor * divisor <= value) {
    while (value % divisor === 0) {
      factors.set(divisor, (factors.get(divisor) ?? 0) + 1);
      value /= divisor;
    }

    divisor = divisor === 2 ? 3 : divisor + 2;
  }

  if (value > 1) {
    factors.set(value, (factors.get(value) ?? 0) + 1);
  }

  return factors;
};

const mergeFactors = (
  numeratorFactors: PrimeFactors,
  denominatorFactors: PrimeFactors,
): PrimeFactors => {
  const result: PrimeFactors = new Map();

  for (const [prime, exponent] of numeratorFactors) {
    result.set(prime, (result.get(prime) ?? 0) + exponent);
  }

  for (const [prime, exponent] of denominatorFactors) {
    result.set(prime, (result.get(prime) ?? 0) - exponent);
  }

  result.delete(2);

  for (const [prime, exponent] of result) {
    if (exponent === 0) {
      result.delete(prime);
    }
  }

  return result;
};

export const factorRatio = (ratio: Ratio): PrimeFactors => {
  const { num, den } = ratio.canonical;

  return mergeFactors(factorInteger(num), factorInteger(den));
};

export const factor357 = (input: number): Factors357 => {
  let value = input;
  let a = 0;
  let b = 0;
  let c = 0;

  while (value % 2 === 0) value /= 2;

  while (value % 3 === 0) {
    value /= 3;
    a++;
  }

  while (value % 5 === 0) {
    value /= 5;
    b++;
  }

  while (value % 7 === 0) {
    value /= 7;
    c++;
  }

  return {
    leftover: value,
    a,
    b,
    c,
  };
};

export const normalizeBelowOne = (
  initialNumerator: number,
  denominator: number,
): {
  num: number;
  den: number;
} => {
  let numerator = initialNumerator;

  while (numerator / denominator < 0.5) numerator *= 2;

  return {
    num: numerator,
    den: denominator,
  };
};

import type { Ratio } from "../../ji/ratio";

export type OddPrimeExponents = ReadonlyMap<bigint, number>;

function factorOddInteger(input: bigint): Map<bigint, number> {
  const factors = new Map<bigint, number>();
  let value = input;

  while (value % 2n === 0n) value /= 2n;

  let divisor = 3n;

  while (divisor * divisor <= value) {
    while (value % divisor === 0n) {
      factors.set(divisor, (factors.get(divisor) ?? 0) + 1);
      value /= divisor;
    }

    divisor += 2n;
  }

  if (value > 1n) factors.set(value, (factors.get(value) ?? 0) + 1);

  return factors;
}

function mergeOddPrimeFactors(
  numeratorFactors: ReadonlyMap<bigint, number>,
  denominatorFactors: ReadonlyMap<bigint, number>,
): OddPrimeExponents {
  const result = new Map<bigint, number>();

  for (const [prime, exponent] of numeratorFactors) result.set(prime, exponent);
  for (const [prime, exponent] of denominatorFactors)
    result.set(prime, (result.get(prime) ?? 0) - exponent);

  for (const [prime, exponent] of result) {
    if (exponent === 0) result.delete(prime);
  }

  return result;
}

export function factorOddPrimes(ratio: Ratio): OddPrimeExponents {
  return mergeOddPrimeFactors(
    factorOddInteger(ratio.numerator),
    factorOddInteger(ratio.denominator),
  );
}

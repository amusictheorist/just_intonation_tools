function isPrime(value: bigint): boolean {
  if (value < 2n) {
    return false;
  }

  for (let divisor = 2n; divisor * divisor <= value; divisor += 1n) {
    if (value % divisor === 0n) return false;
  }

  return true;
}

/**
 * Returns a higher-prime's zero-based ordinal in the sequence beginning at 11.
 *
 * For example, 11 → 0, 13 → 1, 17 → 2.
 *
 * @param prime The prime to check.
 * @returns The prime's ordinal number.
 */

export function getHigherPrimeOrdinal(prime: bigint): bigint {
  let ordinal = 0n;

  for (let candidate = 11n; candidate < prime; candidate += 2n) {
    if (isPrime(candidate)) ordinal += 1n;
  }

  return ordinal;
}

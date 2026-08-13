function isPrime(value: bigint): boolean {
  if (value < 2n) {
    return false;
  }

  for (let divisor = 2n; divisor * divisor <= value; divisor += 1n) {
    if (value % divisor === 0n) return false;
  }

  return true;
}

export function getHigherPrimeOrdinal(prime: bigint): bigint {
  let ordinal = 0n;

  for (let candidate = 11n; candidate < prime; candidate += 2n) {
    if (isPrime(candidate)) ordinal += 1n;
  }

  return ordinal;
}

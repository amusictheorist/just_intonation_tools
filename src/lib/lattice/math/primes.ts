export const sieve = (limit: number): number[] => {
  if (limit < 2) return [];

  const isPrime = Array<boolean>(limit + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  for (let candidate = 2; candidate * candidate <= limit; candidate++) {
    if (!isPrime[candidate]) continue;

    for (
      let multiple = candidate * candidate;
      multiple <= limit;
      multiple += candidate
    ) {
      isPrime[multiple] = false;
    }
  }

  return isPrime
    .map((prime, index) => (prime ? index : null))
    .filter((value): value is number => value !== null);
};

const MAX_PRIME = 127;

export const ALL_PRIMES = sieve(MAX_PRIME);

export const PRIME_INDEX: Record<number, number> = Object.fromEntries(
  ALL_PRIMES.map((prime, index) => [prime, index]),
);

export const N = ALL_PRIMES.length;

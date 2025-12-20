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

const MAX_PRIME = 127;
const ALL_PRIMES = sieve(MAX_PRIME);
export const PRIME_INDEX = {};
ALL_PRIMES.forEach((p, i) => PRIME_INDEX[p] = i);
export const N = ALL_PRIMES.length;
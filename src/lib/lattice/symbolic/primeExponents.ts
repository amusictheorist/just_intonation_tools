/**
 * Prime-factor exponent coordinates for a lattice ratio.
 *
 * Missing primes are interpreted as exponent zero, and zero-exponent entries are ommitted from canonical representations.
 */
export type PrimeExponents = ReadonlyMap<bigint, number>;

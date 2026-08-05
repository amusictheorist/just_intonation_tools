export const gcd = (first: number, second: number): number => {
  const a = Math.abs(first);
  const b = Math.abs(second);

  return b === 0 ? a : gcd(b, a % b);
};

export const gcdArray = (values: readonly number[]): number => {
  if (values.length === 0) {
    throw new Error("gcdArray requires at least one value");
  }

  return values.reduce((currentGcd, value) => gcd(currentGcd, value));
};

export const stripPowersOf2 = (value: number): number => {
  let reducedValue = value;

  while (reducedValue > 1 && reducedValue % 2 === 0) {
    reducedValue /= 2;
  }

  return reducedValue;
};

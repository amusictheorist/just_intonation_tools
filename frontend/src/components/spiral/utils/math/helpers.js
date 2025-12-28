export const gcd = (a, b) => {
  return b === 0 ? a : gcd(b, a % b);
};

export const gcdArray = arr => {
  return arr.reduce((acc, val) => gcd(acc, val), arr[0]);
};

export const stripPowersOf2 = n => {
  while (n % 2 === 0 && n > 1) {
    n /= 2;
  }
  return n;
};

export const sumArray = arr => {
  return arr.reduce((acc, val) => acc + val, 0);
};
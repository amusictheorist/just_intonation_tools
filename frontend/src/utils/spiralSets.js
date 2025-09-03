export function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

export function gcdArray(arr) {
  return arr.reduce((acc, val) => gcd(acc, val), arr[0]);
}

export function stripPowersOf2(n) {
  while (n % 2 === 0 && n > 1) {
    n = n / 2;
  }
  return n;
}

export function getParset(arr) {
  return [...arr].sort((a, b) => a - b);
}

export function getParcset(arr) {
  const reduced = arr.map(stripPowersOf2);
  return [...new Set(reduced)].sort((a, b) => a - b);
}

export function getParSC(arr) {
  const g = gcdArray(arr);
  return arr.map(x => x / g).sort((a, b) => a - b);
}

export function getParcSC(arr) {
  const g = gcdArray(arr);
  const reduced = arr.map(x => stripPowersOf2(x / g));
  return [...new Set(reduced)].sort((a, b) => a - b);
}

export function sumArray(arr) {
  return arr.reduce((acc, val) => acc + val, 0);
}
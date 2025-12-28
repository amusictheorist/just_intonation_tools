import {  gcd, gcdArray, stripPowersOf2 } from "./helpers";

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

const simplifyFraction = (num, denom) => {
  const g = gcd(num, denom);
  return [num / g, denom / g];
}

export function getPitchIntMatrix(arr) {
  const sorted = getParset(arr);
  const n = sorted.length;
  const matrix = Array.from({ length: n }, () => Array(n).fill(""));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;

      let [num, denom] = simplifyFraction(sorted[Math.max(i, j)], sorted[Math.min(i, j)]);
      if (i < j) {
        matrix[i][j] = `${num}/${denom}`;
      } else {
        matrix[i][j] = `${denom}/${num}`;
      }
    }
  }

  return { elements: sorted, matrix };
}

export function getPCIntMatrix(arr) {
  const sorted = getParcset(arr);
  const n = sorted.length;
  const matrix = Array.from({ length: n }, () => Array(n).fill(''));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;

      let [num, denom] = simplifyFraction(sorted[Math.max(i, j)], sorted[Math.min(i, j)]);
      num = stripPowersOf2(num);
      denom = stripPowersOf2(denom);

      if (i < j) {
        matrix[i][j] = `${num}/${denom}`;
      } else {
        matrix[i][j] = `${denom}/${num}`;
      }
    }
  }

  return { elements: sorted, matrix };
}

export function getSubsets(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;
  const groups = {};

  for (let mask = 1; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        subset.push(sorted[i]);
      }
    }
    if (subset.length > 2 && subset.length < n) {
      const size = subset.length;
      if (!groups[size]) groups[size] = [];
      groups[size].push(subset);
    }
  }

  return groups;
}
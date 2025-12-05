import { reduceFraction, rationalApproximation, octaveReduce } from "./helpers.js";

export const parseRatio = (inputRaw, options = {}) => {
  const { maxDen = 1000, allowNegatives = false } = options;

  const result = {
    valid: false,
    raw: typeof inputRaw == 'string' ? inputRaw.trim() : String(inputRaw),
    error: null,
    canonical: null,
    octave: null
  };

  if (!result.raw) {
    result.error = 'Empty input';
    return result;
  }

  const raw = result.raw.replace(/\s+/g, '');

  let num, den;

  if (raw.includes('/') || raw.includes(':')) {
    const sep = raw.includes('/') ? '/' : ':';
    const parts = raw.split(sep).map(s => s.trim());

    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      result.error = 'Invalid ratio: missing numerator or denominator';
      return result;
    }

    const a = Number(parts[0]);
    const b = Number(parts[1]);

    if (!isFinite(a) || !isFinite(b)) {
      result.error = 'Numerator or denominator is not a number';
      return result;
    }
    if (b === 0) {
      result.error = 'Denominator cannot be zero';
      return result;
    }
    if (!allowNegatives && (a < 0 | b < 0)) {
      result.error = 'Negative values are not allowed';
      return result;
    }

    num = a;
    den = b;
  } else {
    const n = Number(raw);
    if (!isFinite(n)) {
      result.error = 'Input is not a number or ratio';
      return result;
    }
    if (!allowNegatives && n < 0) {
      result.error = 'Negative values are not allowed';
      return result;
    }

    if (Number.isInteger(n)) {
      num = n;
      den = 1;
    } else {
      const frac = rationalApproximation(n, maxDen);
      if (!frac) {
        result.error = 'Could not convert demical to fraction';
        return result;
      }
      num = frac.num;
      den = frac.den;
    }
  }

  let canonical = reduceFraction(num, den);

  if (!Number.isInteger(canonical.num) || !Number.isInteger(canonical.den)) {
    result.error = 'Fraction could not be reduced to integers';
    return result;
  }

  const canonicalValue = canonical.num / canonical.den;
  result.canonical = {
    num: canonical.num,
    den: canonical.den,
    value: canonicalValue
  };

  const octave = octaveReduce(canonical.num, canonical.den);
  result.octave = octave;

  result.valid = true;
  return result;
};

let _idCounter = 0;
const generateId = () => {
  _idCounter++;
  return `r${Date.now().toString(36)}_${_idCounter}`;
};

export const createRatio = (raw, options = {}) => {
  const parsed = parseRatio(raw, options);

  if (!parsed.valid) {
    return {
      id: null,
      raw,
      valid: false,
      error: parsed.error
    };
  }

  return {
    id: options.if || generateId(),
    raw: parsed.raw,
    valid: true,
    error: null,
    canonical: parsed.canonical,
    octave: parsed.octave,
    num: parsed.octave.num,
    den: parsed.octave.den,
    value: parsed.octave.value
  };
};

const tests = [
  // ------------------------
  // SIMPLE INTEGERS
  // ------------------------
  "1",
  "2",
  "16",
  "3",

  // ------------------------
  // DECIMALS
  // ------------------------
  "0.75",        // expect canonical 3/4, octave 3/2
  "1.5",         // canonical 3/2, octave 3/2
  "2.6667",      // canonical ~ 26667/10000 reduced, octave into 4/3
  "0.3333",      // canonical ~ 3333/10000 → octave 4/3

  // ------------------------
  // FRACTIONS
  // ------------------------
  "3/2",
  "4/3",
  "6/4",         // reduce to 3/2
  "81/108",      // reduce to 3/4 → octave 3/2
  "9/4",         // 2.25 → octave 9/8

  // ------------------------
  // RATIOS
  // ------------------------
  "4:3",
  "10:4",        // = 5/2 → octave 5/4
  "15:36",       // reduce then octave

  // ------------------------
  // BELOW 1
  // ------------------------
  "1/3",         // → octave 4/3
  "3/8",         // → octave 3/2
  "5/12",        // → octave 5/3

  // ------------------------
  // NEGATIVES
  // ------------------------
  "-3/2",
  "-0.75",

  // ------------------------
  // INVALIDS
  // ------------------------
  "",
  "foo",
  "/2",
  "3/",
  "3/0",
  "3:2:1",

  // ------------------------
  // BIG NUMBERS
  // ------------------------
  "123456/78901",
  "999999/1000000",

  // ------------------------
  // WEIRD REDUCTION CASES
  // ------------------------
  "100/400",
  "7/14",
  "12/8",
  "50/60",
];

console.log("\n================================================");
console.log("          PARSE RATIO FULL TEST SUITE");
console.log("================================================\n");

for (const t of tests) {
  const out = parseRatio(t);

  console.log(`Input: "${t}"`);
  console.log("Output:", out);

  if (out.valid) {
    // sanity checks
    const { canonical, octave } = out;

    // Check canonical integers
    if (!Number.isInteger(canonical.num) || !Number.isInteger(canonical.den)) {
      console.error(" ❌ Canonical is not integer");
    }

    // Check octave integers
    if (!Number.isInteger(octave.num) || !Number.isInteger(octave.den)) {
      console.error(" ❌ Octave is not integer");
    }

    // Check reduction correctness (canonical)
    const gcdCanon = (function g(a,b){ return b ? g(b, a%b) : a })(canonical.num, canonical.den);
    if (gcdCanon !== 1) console.error(" ❌ Canonical fraction not reduced!");

    // Check octave correctness range
    const val = octave.value;
    if (val < 1 || val >= 2) console.error(" ❌ Octave reduction produced out-of-range value:", val);

    // Check octave reduced fraction fully simplified
    const gcdOct = (function g(a,b){ return b ? g(b, a%b) : a })(octave.num, octave.den);
    if (gcdOct !== 1) console.error(" ❌ Octave fraction NOT fully reduced!");

  }

  console.log("------------------------------------------------\n");
}

console.log("\nDone.\n");

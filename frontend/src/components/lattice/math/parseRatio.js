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
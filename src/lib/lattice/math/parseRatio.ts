import type { ParsedRatio, RatioParseOptions, RatioResult } from "../types";
import {
  octaveReduce,
  rationalApproximation,
  reduceFraction,
} from "./fractions";

export const parseRatio = (
  inputRaw: unknown,
  options: RatioParseOptions = {},
): ParsedRatio => {
  const { maxDen = 1000, allowNegatives = false } = options;

  const raw = typeof inputRaw === "string" ? inputRaw.trim() : String(inputRaw);

  if (!raw) {
    return {
      valid: false,
      raw,
      error: "Empty input",
      canonical: null,
      octave: null,
    };
  }

  const normalizedInput = raw.replace(/\s+/g, "");

  let numerator: number;
  let denominator: number;

  if (normalizedInput.includes("/") || normalizedInput.includes(":")) {
    const separator = normalizedInput.includes("/") ? "/" : ":";
    const parts = normalizedInput.split(separator).map((part) => part.trim());

    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return {
        valid: false,
        raw,
        error: "Invalid ratio: missing numerator or denominator",
        canonical: null,
        octave: null,
      };
    }

    const parsedNumerator = Number(parts[0]);
    const parsedDenominator = Number(parts[1]);

    if (
      !Number.isFinite(parsedNumerator) ||
      !Number.isFinite(parsedDenominator)
    ) {
      return {
        valid: false,
        raw,
        error: "Numerator or denominator is not a number",
        canonical: null,
        octave: null,
      };
    }

    if (parsedDenominator === 0) {
      return {
        valid: false,
        raw,
        error: "Denominator cannot be zero",
        canonical: null,
        octave: null,
      };
    }

    if (!allowNegatives && (parsedNumerator < 0 || parsedDenominator < 0)) {
      return {
        valid: false,
        raw,
        error: "Negative values are not allowed",
        canonical: null,
        octave: null,
      };
    }

    numerator = parsedNumerator;
    denominator = parsedDenominator;
  } else {
    const parsedNumber = Number(normalizedInput);

    if (!Number.isFinite(parsedNumber)) {
      return {
        valid: false,
        raw,
        error: "Input is not a number or ratio",
        canonical: null,
        octave: null,
      };
    }

    if (!allowNegatives && parsedNumber < 0) {
      return {
        valid: false,
        raw,
        error: "Negative values are not allowed",
        canonical: null,
        octave: null,
      };
    }

    if (Number.isInteger(parsedNumber)) {
      numerator = parsedNumber;
      denominator = 1;
    } else {
      const fraction = rationalApproximation(parsedNumber, maxDen);

      if (!fraction) {
        return {
          valid: false,
          raw,
          error: "Could not convert decimal to fraction",
          canonical: null,
          octave: null,
        };
      }

      numerator = fraction.num;
      denominator = fraction.den;
    }
  }

  const canonical = reduceFraction(numerator, denominator);

  if (!Number.isInteger(canonical.num) || !Number.isInteger(canonical.den)) {
    return {
      valid: false,
      raw,
      error: "Fraction could not be reduced to integers",
      canonical: null,
      octave: null,
    };
  }

  const canonicalWithValue = {
    ...canonical,
    value: canonical.num / canonical.den,
  };

  return {
    valid: true,
    raw,
    error: null,
    canonical: canonicalWithValue,
    octave: octaveReduce(canonical.num, canonical.den),
  };
};

let idCounter = 0;

const generateId = (): string => {
  idCounter++;
  return `r${Date.now().toString(36)}_${idCounter}`;
};

export const createRatio = (
  raw: string,
  options: RatioParseOptions & { id?: string } = {},
): RatioResult => {
  const parsed = parseRatio(raw, options);

  if (!parsed.valid) {
    return {
      id: null,
      raw,
      valid: false,
      error: parsed.error,
    };
  }

  return {
    id: options.id ?? generateId(),
    raw: parsed.raw,
    valid: true,
    error: null,
    canonical: parsed.canonical,
    octave: parsed.octave,
    num: parsed.octave.num,
    den: parsed.octave.den,
    value: parsed.octave.value,
  };
};

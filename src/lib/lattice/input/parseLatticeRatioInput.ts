import { createPositiveInteger } from "../../ji/integer/positiveInteger";
import { createRatio, type Ratio } from "../../ji/ratio/ratio";

export type ParseLatticeRatioInputResult =
  | Readonly<{
      success: true;
      ratio: Ratio;
    }>
  | Readonly<{
      success: false;
      error: string;
    }>;

function isPositiveIntegerText(value: string): boolean {
  return /^[1-9]\d*$/.test(value.trim());
}

export function parseLatticeRatioInput(
  input: string,
): ParseLatticeRatioInputResult {
  if (!input.trim()) {
    return {
      success: false,
      error: "Input cannot be empty.",
    };
  }

  const separators = ["/", ":", ","];
  const usedSeparators = separators.filter((separator) =>
    input.includes(separator),
  );

  if (usedSeparators.length > 1) {
    return {
      success: false,
      error: "Input must use a single separator.",
    };
  }

  const separator = usedSeparators[0];

  if (!separator) {
    if (!isPositiveIntegerText(input)) {
      return {
        success: false,
        error: "Ratio terms must be positive integers.",
      };
    }

    return {
      success: true,
      ratio: createRatio(
        createPositiveInteger(BigInt(input)),
        createPositiveInteger(1n),
      ),
    };
  }

  const parts = input.split(separator);

  if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
    return {
      success: false,
      error: "Input must include both numerator and denominator.",
    };
  }

  const [numeratorText, denominatorText] = parts;

  if (
    !isPositiveIntegerText(numeratorText) ||
    !isPositiveIntegerText(denominatorText)
  ) {
    return {
      success: false,
      error: "Ratio terms must be positive integers.",
    };
  }

  return {
    success: true,
    ratio: createRatio(
      createPositiveInteger(BigInt(numeratorText)),
      createPositiveInteger(BigInt(denominatorText)),
    ),
  };
}

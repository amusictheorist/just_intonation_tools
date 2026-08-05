const MINIMUM_PARTIAL = 1;
const MAXIMUM_PARTIAL = 1024;

export type PartialInputResult =
  | {
      valid: true;
      values: number[];
    }
  | {
      valid: false;
      error: string;
    };

export const parsePartialInput = (input: string): PartialInputResult => {
  const normalized = input.replace(/[–—]/g, "-");

  const tokens = normalized.split(/[,\s]+/);

  const parsedValues: number[] = [];

  for (const token of tokens) {
    if (!token) {
      continue;
    }

    const rangeMatch = token.match(/^(\d+)-(\d+)$/);

    if (rangeMatch) {
      let start = Number(rangeMatch[1]);
      let end = Number(rangeMatch[2]);

      if (start > end) {
        [start, end] = [end, start];
      }

      for (let value = start; value <= end; value += 1) {
        parsedValues.push(value);
      }

      continue;
    }

    if (/^\d+$/.test(token)) {
      parsedValues.push(Number(token));
    }
  }

  const validValues = Array.from(new Set(parsedValues)).filter(
    (value) => value >= MINIMUM_PARTIAL && value <= MAXIMUM_PARTIAL,
  );

  if (validValues.length === 0) {
    return {
      valid: false,
      error: "Enter integers or ranges between 1 and 1024.",
    };
  }

  return {
    valid: true,
    values: validValues,
  };
};

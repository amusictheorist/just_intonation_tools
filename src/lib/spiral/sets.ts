import { gcd, gcdArray, stripPowersOf2 } from "./helpers";

export type IntervalMatrix = {
  elements: number[];
  matrix: string[][];
};

export type SubsetGroups = Record<number, number[][]>;

export const getParset = (values: readonly number[]): number[] =>
  [...values].sort((first, second) => first - second);

export const getParcset = (values: readonly number[]): number[] => {
  const reduced = values.map(stripPowersOf2);

  return Array.from(new Set(reduced)).sort((first, second) => first - second);
};

export const getParSC = (values: readonly number[]): number[] => {
  const divisor = gcdArray(values);

  return values
    .map((value) => value / divisor)
    .sort((first, second) => first - second);
};

export const getParcSC = (values: readonly number[]): number[] => {
  const divisor = gcdArray(values);

  const reduced = values.map((value) => stripPowersOf2(value / divisor));

  return Array.from(new Set(reduced)).sort((first, second) => first - second);
};

export const sumArray = (values: readonly number[]): number =>
  values.reduce((total, value) => total + value, 0);

const simplifyFraction = (
  numerator: number,
  denominator: number,
): [number, number] => {
  const divisor = gcd(numerator, denominator);

  return [numerator / divisor, denominator / divisor];
};

export const getPartialIntervalMatrix = (
  values: readonly number[],
): IntervalMatrix => {
  const elements = getParset(values);

  const matrix = Array.from({ length: elements.length }, () =>
    Array<string>(elements.length).fill(""),
  );

  for (let row = 0; row < elements.length; row += 1) {
    for (let column = 0; column < elements.length; column += 1) {
      if (row === column) {
        continue;
      }

      const larger = elements[Math.max(row, column)];

      const smaller = elements[Math.min(row, column)];

      const [numerator, denominator] = simplifyFraction(larger, smaller);

      matrix[row][column] =
        row < column
          ? `${numerator}/${denominator}`
          : `${denominator}/${numerator}`;
    }
  }

  return {
    elements,
    matrix,
  };
};

export const getPCIntMatrix = (values: readonly number[]): IntervalMatrix => {
  const elements = getParcset(values);

  const matrix = Array.from({ length: elements.length }, () =>
    Array<string>(elements.length).fill(""),
  );

  for (let row = 0; row < elements.length; row += 1) {
    for (let column = 0; column < elements.length; column += 1) {
      if (row === column) {
        continue;
      }

      const larger = elements[Math.max(row, column)];

      const smaller = elements[Math.min(row, column)];

      let [numerator, denominator] = simplifyFraction(larger, smaller);

      numerator = stripPowersOf2(numerator);

      denominator = stripPowersOf2(denominator);

      matrix[row][column] =
        row < column
          ? `${numerator}/${denominator}`
          : `${denominator}/${numerator}`;
    }
  }

  return {
    elements,
    matrix,
  };
};

export const getSubsets = (values: readonly number[]): SubsetGroups => {
  const sortedValues = getParset(values);
  const groups: SubsetGroups = {};

  const collectSubsets = (
    startIndex: number,
    currentSubset: number[],
  ): void => {
    if (
      currentSubset.length > 2 &&
      currentSubset.length < sortedValues.length
    ) {
      const size = currentSubset.length;

      groups[size] ??= [];
      groups[size].push([...currentSubset]);
    }

    for (let index = startIndex; index < sortedValues.length; index += 1) {
      currentSubset.push(sortedValues[index]);

      collectSubsets(index + 1, currentSubset);

      currentSubset.pop();
    }
  };

  collectSubsets(0, []);

  return groups;
};

import { describe, expect, it } from "vitest";
import { normalizeLatticeLabelRatio } from "./normalizeLatticeLabelRatio";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";
import { createUnisonRatio } from "../../ji/ratio/createUnisonRatio";

describe("normalizeLatticeLabelRatio", () => {
  it("normalizes a ratio above the upper octave into [1, 2)", () => {
    expect(normalizeLatticeLabelRatio(createTestRatio(3n, 1n))).toEqual(
      createTestRatio(3n, 2n),
    );
  });

  it("keeps a ratio already in the upper octave unchanged", () => {
    expect(normalizeLatticeLabelRatio(createTestRatio(3n, 2n))).toEqual(
      createTestRatio(3n, 2n),
    );
  });

  it("normalizes a ratio below unison into [1, 2)", () => {
    expect(normalizeLatticeLabelRatio(createTestRatio(3n, 4n))).toEqual(
      createTestRatio(3n, 2n),
    );
  });

  it("normalizes an exact octave to unison", () => {
    expect(normalizeLatticeLabelRatio(createTestRatio(2n, 1n))).toEqual(
      createUnisonRatio(),
    );
  });
});

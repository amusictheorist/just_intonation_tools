import { describe, expect, it } from "vitest";
import { normalizeRadialRatio } from "./normalizeRadialRatio";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";
import { createUnisonRatio } from "../../ji/createUnisonRatio";

describe("normalizeRadialRatio", () => {
  it("preserves a ratio already in the upper octave", () => {
    expect(normalizeRadialRatio(createTestRatio(3n, 2n))).toEqual(
      createTestRatio(3n, 2n),
    );
  });

  it("raises a lower-octave ratio into the upper octave", () => {
    expect(normalizeRadialRatio(createTestRatio(3n, 4n))).toEqual(
      createTestRatio(3n, 2n),
    );
  });

  it("reduces a ratio above the upper octave", () => {
    expect(normalizeRadialRatio(createTestRatio(3n, 1n))).toEqual(
      createTestRatio(3n, 2n),
    );
  });

  it("normalizes powers of 2 to unison", () => {
    expect(normalizeRadialRatio(createTestRatio(8n, 1n))).toEqual(
      createUnisonRatio(),
    );
  });
});

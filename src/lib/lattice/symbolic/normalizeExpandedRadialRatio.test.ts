import { describe, expect, it } from "vitest";
import { normalizeExpandedRadialRatio } from "./normalizeExpandedRadialRatio";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";

describe("normalizeExpandedRadialRatio", () => {
  it("leaves unison unchanged", () => {
    expect(normalizeExpandedRadialRatio(createTestRatio(1n, 1n))).toEqual(
      createTestRatio(1n, 1n),
    );
  });

  it("normalizes ratios above the upper octave into [1, 2)", () => {
    expect(normalizeExpandedRadialRatio(createTestRatio(11n, 1n))).toEqual(
      createTestRatio(11n, 8n),
    );
  });

  it("normalizes ratios below the lower octave into [1/2, 1)", () => {
    expect(normalizeExpandedRadialRatio(createTestRatio(1n, 11n))).toEqual(
      createTestRatio(8n, 11n),
    );
  });

  it("leaves ratios already in the upper target octave unchanged", () => {
    expect(normalizeExpandedRadialRatio(createTestRatio(3n, 2n))).toEqual(
      createTestRatio(3n, 2n),
    );
  });

  it("leaves ratios already in the lower target octave unchanged", () => {
    expect(normalizeExpandedRadialRatio(createTestRatio(2n, 3n))).toEqual(
      createTestRatio(2n, 3n),
    );
  });

  it("includes 1/2 in the lower target octave", () => {
    expect(normalizeExpandedRadialRatio(createTestRatio(1n, 2n))).toEqual(
      createTestRatio(1n, 2n),
    );
  });

  it("normalizes 2/1 to a unison", () => {
    expect(normalizeExpandedRadialRatio(createTestRatio(2n, 1n))).toEqual(
      createTestRatio(1n, 1n),
    );
  });
});

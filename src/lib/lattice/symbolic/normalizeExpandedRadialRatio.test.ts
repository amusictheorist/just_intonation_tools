import { describe, expect, it } from "vitest";
import { normalizeExpandedRadialRatio } from "./normalizeExpandedRadialRatio";
import { createRatio } from "../../ji/ratio";
import { createPositiveInteger } from "../../ji/positiveInteger";

function ratio(numerator: bigint, denominator: bigint) {
  return createRatio(
    createPositiveInteger(numerator),
    createPositiveInteger(denominator),
  );
}

describe("normalizeExpandedRadialRatio", () => {
  it("leaves unison unchanged", () => {
    expect(normalizeExpandedRadialRatio(ratio(1n, 1n))).toEqual(ratio(1n, 1n));
  });

  it("normalizes ratios above the upper octave into [1, 2)", () => {
    expect(normalizeExpandedRadialRatio(ratio(11n, 1n))).toEqual(
      ratio(11n, 8n),
    );
  });

  it("normalizes ratios below the lower octave into [1/2, 1)", () => {
    expect(normalizeExpandedRadialRatio(ratio(1n, 11n))).toEqual(
      ratio(8n, 11n),
    );
  });

  it("leaves ratios already in the upper target octave unchanged", () => {
    expect(normalizeExpandedRadialRatio(ratio(3n, 2n))).toEqual(ratio(3n, 2n));
  });

  it("leaves ratios already in the lower target octave unchanged", () => {
    expect(normalizeExpandedRadialRatio(ratio(2n, 3n))).toEqual(ratio(2n, 3n));
  });

  it("includes 1/2 in the lower target octave", () => {
    expect(normalizeExpandedRadialRatio(ratio(1n, 2n))).toEqual(ratio(1n, 2n));
  });

  it("normalizes 2/1 to a unison", () => {
    expect(normalizeExpandedRadialRatio(ratio(2n, 1n))).toEqual(ratio(1n, 1n));
  });
});

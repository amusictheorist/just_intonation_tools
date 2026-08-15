import { describe, expect, it } from "vitest";
import { parseLatticeRatioInput } from "./parseLatticeRatioInput";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";

describe("parseLatticeRatioInput", () => {
  it("parses numerator/denominator ratio input", () => {
    expect(parseLatticeRatioInput("3/2")).toEqual({
      success: true,
      ratio: createTestRatio(3n, 2n),
    });
  });

  it("returns the canonical reduced ratio", () => {
    expect(parseLatticeRatioInput("6/4")).toEqual({
      success: true,
      ratio: createTestRatio(3n, 2n),
    });
  });

  it("parses colon-separated input", () => {
    expect(parseLatticeRatioInput("3:2")).toEqual({
      success: true,
      ratio: createTestRatio(3n, 2n),
    });
  });

  it("parses comma-separated input", () => {
    expect(parseLatticeRatioInput("3,2")).toEqual({
      success: true,
      ratio: createTestRatio(3n, 2n),
    });
  });

  it("ignores whitespace around an explicit separator", () => {
    expect(parseLatticeRatioInput("   3 ,  2   ")).toEqual({
      success: true,
      ratio: createTestRatio(3n, 2n),
    });
  });

  it("interprets a single integer as a ratio over 1", () => {
    expect(parseLatticeRatioInput("3")).toEqual({
      success: true,
      ratio: createTestRatio(3n, 1n),
    });
  });

  it("rejects empty input", () => {
    expect(parseLatticeRatioInput("")).toEqual({
      success: false,
      error: "Input cannot be empty.",
    });
  });

  it("rejects a missing denominator", () => {
    expect(parseLatticeRatioInput("3/")).toEqual({
      success: false,
      error: "Input must include both numerator and denominator.",
    });
  });

  it("rejects a missing numerator", () => {
    expect(parseLatticeRatioInput("/2")).toEqual({
      success: false,
      error: "Input must include both numerator and denominator.",
    });
  });

  it("rejects non-integer ratio terms", () => {
    expect(parseLatticeRatioInput("3.5/2")).toEqual({
      success: false,
      error: "Ratio terms must be positive integers.",
    });
  });

  it("rejects zero-valued ratio terms", () => {
    expect(parseLatticeRatioInput("3/0")).toEqual({
      success: false,
      error: "Ratio terms must be positive integers.",
    });
  });

  it("rejects negative ratio terms", () => {
    expect(parseLatticeRatioInput("-3/2")).toEqual({
      success: false,
      error: "Ratio terms must be positive integers.",
    });
  });

  it("rejects input with multiple ratio separators", () => {
    expect(parseLatticeRatioInput("3/2:1")).toEqual({
      success: false,
      error: "Input must use a single separator.",
    });
  });

  it("rejects more than two ratio terms", () => {
    expect(parseLatticeRatioInput("3/2/1")).toEqual({
      success: false,
      error: "Input must include both numerator and denominator.",
    });
  });
});

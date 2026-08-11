import { describe, expect, it } from "vitest";
import { parsePartialSetInput } from "./parsePartialSetInput";

describe("parsePartialSetInput", () => {
  it.each([
    ["4, 5, 6", [4n, 5n, 6n]],
    ["4 5 6", [4n, 5n, 6n]],
    ["4,5  6", [4n, 5n, 6n]],
    ["12, 15, 18", [12n, 15n, 18n]],
  ])("parses %s as a partial set", (input, expected) => {
    const result = parsePartialSetInput(input);

    expect(result.members).toEqual(expected);
  });

  it.each([
    ["", "empty input"],
    ["0", "zero"],
    ["-4", "negative integer"],
    ["4.5", "decimal"],
    ["4/5", "fraction"],
    ["4-6", "range syntax"],
    ["4, five, 5", "malformed token"],
  ])("rejects %s (%s)", (input) => {
    expect(() => parsePartialSetInput(input)).toThrow();
  });

  it("normalizes the parsed partial set", () => {
    const result = parsePartialSetInput("6, 4, 5, 4");

    expect(result.members).toEqual([4n, 5n, 6n]);
  });
});

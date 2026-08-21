import { describe, expect, it } from "vitest";
import { arePrimeExponentPositionsAxisAligned } from "./arePrimeExponentPositionsAxisAligned";

describe("arePrimeExponentPositionsAxisAligned", () => {
  it("recognizes positions differing along one prime axis", () => {
    expect(
      arePrimeExponentPositionsAxisAligned(
        new Map([[3n, 1]]),
        new Map([[3n, 2]]),
      ),
    ).toBe(true);
  });

  it("recognizes adding one prime dimension as axis aligned", () => {
    expect(
      arePrimeExponentPositionsAxisAligned(
        new Map([[3n, 1]]),
        new Map([
          [3n, 1],
          [5n, 1],
        ]),
      ),
    ).toBe(true);
  });

  it("rejects positions differing along multiple prime axes", () => {
    expect(
      arePrimeExponentPositionsAxisAligned(
        new Map([[3n, 1]]),
        new Map([[5n, 1]]),
      ),
    ).toBe(false);
  });

  it("rejects identical positions", () => {
    expect(
      arePrimeExponentPositionsAxisAligned(
        new Map([[3n, 1]]),
        new Map([[3n, 1]]),
      ),
    ).toBe(false);
  });
});

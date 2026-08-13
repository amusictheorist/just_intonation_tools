import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { factorableRatioArbitrary } from "../../ji/test/ratioArbitraries";
import { createExpandedRadialAddress } from "../symbolic/createExpandedRadialAddress";
import { createRadialPosition } from "./createRadialPosition";
import { createExpandedRadialPosition } from "./createExpandedRadialPosition";

describe("createExpandedRadialPosition properties", () => {
  it("negates all coordinates for lower-side continuous symmetry", () => {
    fc.assert(
      fc.property(factorableRatioArbitrary, (ratio) => {
        const address = createExpandedRadialAddress(ratio);
        fc.pre(address.side === "lower");

        const ordinary = createRadialPosition(address, true);
        const expanded = createExpandedRadialPosition(
          address,
          true,
          "continuous",
        );

        expect(expanded.x).toBeCloseTo(-ordinary.x);
        expect(expanded.y).toBeCloseTo(-ordinary.y);
        expect(expanded.z).toBeCloseTo(-ordinary.z);
      }),
    );
  });

  it("negates only y for lower-side aligned symmetry", () => {
    fc.assert(
      fc.property(factorableRatioArbitrary, (ratio) => {
        const address = createExpandedRadialAddress(ratio);
        fc.pre(address.side === "lower");

        const ordinary = createRadialPosition(address, true);
        const expanded = createExpandedRadialPosition(address, true, "aligned");

        expect(expanded.x).toBeCloseTo(ordinary.x);
        expect(expanded.y).toBeCloseTo(-ordinary.y);
        expect(expanded.z).toBeCloseTo(ordinary.z);
      }),
    );
  });
});

import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { factorableRatioArbitrary } from "../../ji/test/ratioArbitraries";
import { createExpandedRadialAddress } from "../symbolic/createExpandedRadialAddress";
import { createExpandedRadialPosition } from "./createExpandedRadialPosition";
import { inverRatio } from "../../ji/invertRatio";

describe("createExpandedRadialPosition properties", () => {
  it("aligns lower-side ratios with their upper-side inverses", () => {
    fc.assert(
      fc.property(factorableRatioArbitrary, (ratio) => {
        const lowerAddress = createExpandedRadialAddress(ratio);

        fc.pre(lowerAddress.side === "lower");

        const upperAddress = createExpandedRadialAddress(inverRatio(ratio));

        const lowerPosition = createExpandedRadialPosition(
          lowerAddress,
          true,
          "aligned",
        );

        const upperPosition = createExpandedRadialPosition(
          upperAddress,
          true,
          "aligned",
        );

        expect(lowerPosition.x).toBeCloseTo(upperPosition.x);
        expect(lowerPosition.y).toBeCloseTo(-upperPosition.y);
        expect(lowerPosition.z).toBeCloseTo(upperPosition.z);
      }),
    );
  });

  it("rotates lower-side aligned placement by 180 degrees in continuous mode", () => {
    fc.assert(
      fc.property(factorableRatioArbitrary, (ratio) => {
        const address = createExpandedRadialAddress(ratio);

        fc.pre(address.side === "lower");

        const alignedPosition = createExpandedRadialPosition(
          address,
          true,
          "aligned",
        );

        const continuousPosition = createExpandedRadialPosition(
          address,
          true,
          "continuous",
        );

        expect(continuousPosition.x).toBeCloseTo(-alignedPosition.x);
        expect(continuousPosition.y).toBeCloseTo(alignedPosition.y);
        expect(continuousPosition.z).toBeCloseTo(-alignedPosition.z);
      }),
    );
  });
});

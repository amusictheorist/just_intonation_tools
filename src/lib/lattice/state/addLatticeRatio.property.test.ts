import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { ratioArbitrary } from "../../ji/test/ratioArbitraries";
import { createLatticeRatio } from "./createLatticeRatio";
import { addLatticeRatio } from "./addLatticeRatio";
import { areRatiosEqual } from "../../ji/areRatiosEqual";

describe("addLatticeRatio properties", () => {
  it("does not add a ratio that is already present", () => {
    fc.assert(
      fc.property(ratioArbitrary, (ratio) => {
        const existing = createLatticeRatio("ratio-1", "existing", ratio);
        const duplicate = createLatticeRatio("ratio-2", "duplicate", ratio);

        const ratios = [existing];

        expect(addLatticeRatio(ratios, duplicate)).toEqual({
          status: "duplicate",
          ratios,
          existingRatio: existing,
        });
      }),
    );
  });

  it("appends a distinct ratio without changing the existing collection order", () => {
    fc.assert(
      fc.property(ratioArbitrary, ratioArbitrary, (firstRatio, secondRatio) => {
        fc.pre(!areRatiosEqual(firstRatio, secondRatio));

        const first = createLatticeRatio("ratio-1", "first", firstRatio);
        const second = createLatticeRatio("ratio-2", "second", secondRatio);

        expect(addLatticeRatio([first], second)).toEqual({
          status: "added",
          ratios: [first, second],
        });
      }),
    );
  });
});

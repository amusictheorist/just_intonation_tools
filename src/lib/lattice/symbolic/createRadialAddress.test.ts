import { describe, expect, it } from "vitest";
import { createRadialAddress } from "./createRadialAddress";
import { createUnisonRatio } from "../../ji/ratio/createUnisonRatio";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";

describe("createRadialAddress", () => {
  it("places unison at zero generator distance with an empty path", () => {
    const normalizedRatio = createUnisonRatio();

    expect(createRadialAddress(normalizedRatio, new Map())).toEqual({
      normalizedRatio,
      path: [],
      distance: 0,
    });
  });

  it("creates a radial address from the canonical prime-factor path", () => {
    const normalizedRatio = createTestRatio(99n, 10n);

    expect(
      createRadialAddress(
        normalizedRatio,
        new Map([
          [3n, 2],
          [5n, -1],
          [11n, 1],
        ]),
      ),
    ).toEqual({
      normalizedRatio,
      path: [
        { prime: 3n, direction: 1 },
        { prime: 3n, direction: 1 },
        { prime: 5n, direction: -1 },
        { prime: 11n, direction: 1 },
      ],
      distance: 4,
    });
  });
});

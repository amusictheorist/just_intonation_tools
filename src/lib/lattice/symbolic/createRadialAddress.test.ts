import { describe, expect, it } from "vitest";
import { createRadialAddress } from "./createRadialAddress";

describe("createRadialAddress", () => {
  it("places unison at zero generator distance with an empty path", () => {
    expect(createRadialAddress(new Map())).toEqual({
      path: [],
      distance: 0,
    });
  });

  it("creates a radial address from the canonical prime-factor path", () => {
    expect(
      createRadialAddress(
        new Map([
          [3n, 2],
          [5n, -1],
          [11n, 1],
        ]),
      ),
    ).toEqual({
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

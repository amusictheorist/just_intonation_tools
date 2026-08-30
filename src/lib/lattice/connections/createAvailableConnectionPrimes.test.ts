import { describe, expect, it } from "vitest";
import { createAvailableConnectionPrimes } from "./createAvailableConnectionPrimes";

describe("createAvailableConnectionPrimes", () => {
  it("returns unique connection primes in ascending order", () => {
    expect(
      createAvailableConnectionPrimes([
        { fromId: "a", toId: "b", prime: 11n },
        { fromId: "b", toId: "c", prime: 3n },
        { fromId: "c", toId: "d", prime: 11n },
        { fromId: "d", toId: "e", prime: 5n },
      ]),
    ).toEqual([3n, 5n, 11n]);
  });

  it("returns an empty list when there are no connections", () => {
    expect(createAvailableConnectionPrimes([])).toEqual([]);
  });
});

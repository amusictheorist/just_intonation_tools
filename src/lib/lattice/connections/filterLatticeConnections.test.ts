import { describe, expect, it } from "vitest";
import { filterLatticeConnections } from "./filterLatticeConnections";

const connections = [
  { fromId: "a", toId: "b", prime: 3n },
  { fromId: "b", toId: "c", prime: 5n },
  { fromId: "c", toId: "d", prime: 11n },
] as const;

describe("filterLatticeConnections", () => {
  it("returns no connectinos when connections are hidden", () => {
    expect(
      filterLatticeConnections(connections, {
        showConnections: false,
        visiblePrimes: null,
      }),
    ).toEqual([]);
  });

  it("returns all connectinos when no prime filter is applied", () => {
    expect(
      filterLatticeConnections(connections, {
        showConnections: true,
        visiblePrimes: null,
      }),
    ).toEqual(connections);
  });

  it("returns only connectinos on visible prime axes", () => {
    expect(
      filterLatticeConnections(connections, {
        showConnections: true,
        visiblePrimes: new Set([3n, 11n]),
      }),
    ).toEqual([
      { fromId: "a", toId: "b", prime: 3n },
      { fromId: "c", toId: "d", prime: 11n },
    ]);
  });
});

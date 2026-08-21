import { describe, expect, it } from "vitest";
import { createRadialConnections } from "./createRadialConnections";

describe("createRadialConnections", () => {
  it("connects unison to a prime generator", () => {
    expect(
      createRadialConnections([
        {
          id: "unison",
          exponents: new Map(),
        },
        {
          id: "three",
          exponents: new Map([[3n, 1]]),
        },
      ]),
    ).toEqual([{ fromId: "unison", toId: "three" }]);
  });

  it("connects a composite along each prime axis", () => {
    expect(
      createRadialConnections([
        {
          id: "three",
          exponents: new Map([[3n, 1]]),
        },
        {
          id: "five",
          exponents: new Map([[5n, 1]]),
        },
        {
          id: "fifteen",
          exponents: new Map([
            [3n, 1],
            [5n, 1],
          ]),
        },
      ]),
    ).toEqual([
      { fromId: "three", toId: "fifteen" },
      { fromId: "five", toId: "fifteen" },
    ]);
  });

  it("connects higher-prime composites along every visible prime axis", () => {
    expect(
      createRadialConnections([
        {
          id: "three",
          exponents: new Map([[3n, 1]]),
        },
        {
          id: "eleven",
          exponents: new Map([[11n, 1]]),
        },
        {
          id: "thirty-three",
          exponents: new Map([
            [3n, 1],
            [11n, 1],
          ]),
        },
      ]),
    ).toEqual([
      { fromId: "three", toId: "thirty-three" },
      { fromId: "eleven", toId: "thirty-three" },
    ]);
  });

  it("does not connect across an intervening point on the same prime axis", () => {
    expect(
      createRadialConnections([
        {
          id: "unison",
          exponents: new Map(),
        },
        {
          id: "three",
          exponents: new Map([[3n, 1]]),
        },
        {
          id: "nine",
          exponents: new Map([[3n, 2]]),
        },
      ]),
    ).toEqual([
      { fromId: "unison", toId: "three" },
      { fromId: "three", toId: "nine" },
    ]);
  });

  it("connects opposite prime directions through unison", () => {
    expect(
      createRadialConnections([
        {
          id: "lower-three",
          exponents: new Map([[3n, -1]]),
        },
        {
          id: "unison",
          exponents: new Map(),
        },
        {
          id: "upper-three",
          exponents: new Map([[3n, 1]]),
        },
      ]),
    ).toEqual([
      { fromId: "lower-three", toId: "unison" },
      { fromId: "unison", toId: "upper-three" },
    ]);
  });
});

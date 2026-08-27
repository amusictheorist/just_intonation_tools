// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useLatticeRatios } from "./useLatticeRatios";
import { createTestRatio } from "../../../lib/ji/test/ratioTestHelpers";

describe("useLatticeRatios", () => {
  it("adds a valid lattice ratio from input", () => {
    const { result } = renderHook(() => useLatticeRatios());

    let addResult;

    act(() => {
      addResult = result.current.addRatio("3/2");
    });

    expect(addResult).toEqual({
      status: "added",
      ratios: [
        expect.objectContaining({ rawInput: "1/1" }),
        expect.objectContaining({ rawInput: "3/2" }),
      ],
    });

    expect(result.current.ratios).toHaveLength(2);
    expect(result.current.ratios[0]?.rawInput).toBe("1/1");
    expect(result.current.ratios[1]?.rawInput).toBe("3/2");
  });

  it("does not change the ratio state when the input is invalid", () => {
    const { result } = renderHook(() => useLatticeRatios());

    let addResult;

    act(() => {
      addResult = result.current.addRatio("not-a-ratio");
    });

    expect(addResult).toEqual(expect.objectContaining({ status: "invalid" }));

    expect(result.current.ratios).toHaveLength(1);
    expect(result.current.ratios[0]?.rawInput).toBe("1/1");
  });

  it("does not add a duplicate lattice ratio", () => {
    const { result } = renderHook(() => useLatticeRatios());

    act(() => {
      result.current.addRatio("3/2");
    });

    let duplicateResult;

    act(() => {
      duplicateResult = result.current.addRatio("6/4");
    });

    expect(duplicateResult).toEqual(
      expect.objectContaining({ status: "duplicate" }),
    );

    expect(result.current.ratios).toHaveLength(2);
    expect(result.current.ratios[0]?.rawInput).toBe("1/1");
    expect(result.current.ratios[1]?.rawInput).toBe("3/2");
  });

  it("removes a lattice ratio by id", () => {
    const { result } = renderHook(() => useLatticeRatios());

    act(() => {
      result.current.addRatio("3/2");
      result.current.addRatio("5/4");
    });

    const ratioToRemove = result.current.ratios.find(
      (ratio) => ratio.rawInput === "3/2",
    );

    expect(ratioToRemove).toBeDefined();

    act(() => {
      result.current.removeRatio(ratioToRemove!.id);
    });

    expect(result.current.ratios).toHaveLength(2);
    expect(result.current.ratios.map((ratio) => ratio.rawInput)).toEqual([
      "1/1",
      "5/4",
    ]);
  });

  it("resets the lattice ratios", () => {
    const { result } = renderHook(() => useLatticeRatios());

    act(() => {
      result.current.addRatio("3/2");
      result.current.addRatio("5/4");
    });

    expect(result.current.ratios).toHaveLength(3);

    act(() => {
      result.current.reset();
    });

    expect(result.current.ratios).toHaveLength(1);
    expect(result.current.ratios[0]?.rawInput).toBe("1/1");
  });

  it("undoes the most recent ratio change", () => {
    const { result } = renderHook(() => useLatticeRatios());

    act(() => {
      result.current.addRatio("3/2");
    });

    expect(result.current.ratios).toHaveLength(2);

    act(() => {
      result.current.undo();
    });

    expect(result.current.ratios).toHaveLength(1);
    expect(result.current.ratios[0]?.rawInput).toBe("1/1");
  });

  it("undoes a removed lattice ratio", () => {
    const { result } = renderHook(() => useLatticeRatios());

    act(() => {
      result.current.addRatio("3/2");
      result.current.addRatio("5/4");
    });

    const ratioToRemove = result.current.ratios.find(
      (ratio) => ratio.rawInput === "3/2",
    );

    expect(ratioToRemove).toBeDefined();

    act(() => {
      result.current.removeRatio(ratioToRemove!.id);
    });

    expect(result.current.ratios).toHaveLength(2);

    act(() => {
      result.current.undo();
    });

    expect(result.current.ratios).toHaveLength(3);
    expect(result.current.ratios[0]?.rawInput).toBe("1/1");
    expect(result.current.ratios[1]?.rawInput).toBe("3/2");
    expect(result.current.ratios[2]?.rawInput).toBe("5/4");
  });

  it("does not create an undo step for invalid input", () => {
    const { result } = renderHook(() => useLatticeRatios());

    act(() => {
      result.current.addRatio("3/2");
    });

    act(() => {
      result.current.addRatio("not-a-ratio");
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.ratios).toHaveLength(1);
    expect(result.current.ratios[0]?.rawInput).toBe("1/1");
  });

  it("does not create an undo step for a duplicate input", () => {
    const { result } = renderHook(() => useLatticeRatios());

    act(() => {
      result.current.addRatio("3/2");
    });

    act(() => {
      result.current.addRatio("6/4");
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.ratios).toHaveLength(1);
    expect(result.current.ratios[0]?.rawInput).toBe("1/1");
  });

  it("does not create an undo step when removing an unknown id", () => {
    const { result } = renderHook(() => useLatticeRatios());

    act(() => {
      result.current.addRatio("3/2");
    });

    act(() => {
      result.current.removeRatio("missing-id");
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.ratios).toHaveLength(1);
    expect(result.current.ratios[0]?.rawInput).toBe("1/1");
  });

  it("does not create an undo step when resetting the initial lattice", () => {
    const { result } = renderHook(() => useLatticeRatios());

    const initialId = result.current.ratios[0]?.id;

    act(() => {
      result.current.reset();
    });

    expect(result.current.ratios[0]?.id).toBe(initialId);
  });

  it("undoes multiple ratio changes in reverse order", () => {
    const { result } = renderHook(() => useLatticeRatios());

    act(() => {
      result.current.addRatio("3/2");
    });

    act(() => {
      result.current.addRatio("5/4");
    });

    expect(result.current.ratios).toHaveLength(3);

    act(() => {
      result.current.undo();
    });

    expect(result.current.ratios).toHaveLength(2);
    expect(result.current.ratios[0]?.rawInput).toBe("1/1");
    expect(result.current.ratios[1]?.rawInput).toBe("3/2");

    act(() => {
      result.current.undo();
    });

    expect(result.current.ratios).toHaveLength(1);
    expect(result.current.ratios[0]?.rawInput).toBe("1/1");
  });

  it("starts with the unison ratio", () => {
    const { result } = renderHook(() => useLatticeRatios());

    expect(result.current.ratios).toHaveLength(1);
    expect(result.current.ratios[0]).toMatchObject({
      rawInput: "1/1",
      ratio: createTestRatio(1n, 1n),
    });
  });

  it("resets the lattice to the unison ratio", () => {
    const { result } = renderHook(() => useLatticeRatios());

    act(() => {
      result.current.addRatio("3/2");
      result.current.addRatio("5/4");
    });

    expect(result.current.ratios).toHaveLength(3);

    act(() => {
      result.current.reset();
    });

    expect(result.current.ratios).toHaveLength(1);
    expect(result.current.ratios[0]).toMatchObject({
      rawInput: "1/1",
      ratio: createTestRatio(1n, 1n),
    });
  });

  it("does not remove the unison ratio", () => {
    const { result } = renderHook(() => useLatticeRatios());

    const unison = result.current.ratios[0];

    expect(unison?.rawInput).toBe("1/1");

    act(() => {
      result.current.removeRatio(unison!.id);
    });

    expect(result.current.ratios).toHaveLength(1);
    expect(result.current.ratios[0]?.rawInput).toBe("1/1");
  });

  it("does not create an undo step when removing the unison ratio", () => {
    const { result } = renderHook(() => useLatticeRatios());

    act(() => {
      result.current.addRatio("3/2");
    });

    const unison = result.current.ratios.find(
      (ratio) => ratio.rawInput === "1/1",
    );

    expect(unison).toBeDefined();

    act(() => {
      result.current.removeRatio(unison!.id);
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.ratios).toHaveLength(1);
    expect(result.current.ratios[0]?.rawInput).toBe("1/1");
  });
});

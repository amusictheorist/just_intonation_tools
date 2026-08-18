// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useLatticeRatios } from "./useLatticeRatios";

describe("useLatticeRatios", () => {
  it("adds a valid lattice ratio from input", () => {
    const { result } = renderHook(() => useLatticeRatios());

    let addResult;

    act(() => {
      addResult = result.current.addRatio("3/2");
    });

    expect(addResult).toEqual({
      status: "added",
      ratios: [expect.objectContaining({ rawInput: "3/2" })],
    });

    expect(result.current.ratios).toHaveLength(1);
    expect(result.current.ratios[0]?.rawInput).toBe("3/2");
  });

  it("does not change the ratio state when the input is invalid", () => {
    const { result } = renderHook(() => useLatticeRatios());

    let addResult;

    act(() => {
      addResult = result.current.addRatio("not-a-ratio");
    });

    expect(addResult).toEqual(expect.objectContaining({ status: "invalid" }));

    expect(result.current.ratios).toEqual([]);
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

    expect(result.current.ratios).toHaveLength(1);
    expect(result.current.ratios[0]?.rawInput).toBe("3/2");
  });

  it("removes a lattice ratio by id", () => {
    const { result } = renderHook(() => useLatticeRatios());

    act(() => {
      result.current.addRatio("3/2");
      result.current.addRatio("5/4");
    });

    const ratioToRemove = result.current.ratios[0];

    expect(ratioToRemove).toBeDefined();

    act(() => {
      result.current.removeRatio(ratioToRemove!.id);
    });

    expect(result.current.ratios).toHaveLength(1);
    expect(result.current.ratios[0]?.rawInput).toBe("5/4");
  });

  it("rests the lattice ratios", () => {
    const { result } = renderHook(() => useLatticeRatios());

    act(() => {
      result.current.addRatio("3/2");
      result.current.addRatio("5/4");
    });

    expect(result.current.ratios).toHaveLength(2);

    act(() => {
      result.current.reset();
    });

    expect(result.current.ratios).toEqual([]);
  });

  it("undoes the most recent ratio change", () => {
    const { result } = renderHook(() => useLatticeRatios());

    act(() => {
      result.current.addRatio("3/2");
    });

    expect(result.current.ratios).toHaveLength(1);

    act(() => {
      result.current.undo();
    });

    expect(result.current.ratios).toEqual([]);
  });

  it("undoes a removed lattice ratio", () => {
    const { result } = renderHook(() => useLatticeRatios());

    act(() => {
      result.current.addRatio("3/2");
      result.current.addRatio("5/4");
    });

    const ratioToRemove = result.current.ratios[0];

    expect(ratioToRemove).toBeDefined();

    act(() => {
      result.current.removeRatio(ratioToRemove!.id);
    });

    expect(result.current.ratios).toHaveLength(1);

    act(() => {
      result.current.undo();
    });

    expect(result.current.ratios).toHaveLength(2);
    expect(result.current.ratios[0]?.rawInput).toBe("3/2");
    expect(result.current.ratios[1]?.rawInput).toBe("5/4");
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

    expect(result.current.ratios).toEqual([]);
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

    expect(result.current.ratios).toEqual([]);
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

    expect(result.current.ratios).toEqual([]);
  });

  it("does not create an undo step when resetting an empty lattice", () => {
    const { result } = renderHook(() => useLatticeRatios());

    act(() => {
      result.current.addRatio("3/2");
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.ratios).toEqual([]);

    act(() => {
      result.current.reset();
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.ratios).toHaveLength(1);
    expect(result.current.ratios[0]?.rawInput).toBe("3/2");
  });

  it("undoes multiple ratio changes in reverse order", () => {
    const { result } = renderHook(() => useLatticeRatios());

    act(() => {
      result.current.addRatio("3/2");
    });

    act(() => {
      result.current.addRatio("5/4");
    });

    expect(result.current.ratios).toHaveLength(2);

    act(() => {
      result.current.undo();
    });

    expect(result.current.ratios).toHaveLength(1);
    expect(result.current.ratios[0]?.rawInput).toBe("3/2");

    act(() => {
      result.current.undo();
    });

    expect(result.current.ratios).toEqual([]);
  });
});

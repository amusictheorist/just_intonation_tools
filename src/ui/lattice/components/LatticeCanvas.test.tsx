// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { useLatticeScene } from "../hooks/useLatticeScene";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import type { LatticeSceneConnection } from "../../../lib/lattice/presentation/latticeSceneConnection";
import { act, render, screen } from "@testing-library/react";
import LatticeCanvas from "./LatticeCanvas";
import { createTestRatio } from "../../../lib/ji/test/ratioTestHelpers";

vi.mock("../hooks/useLatticeScene", () => ({
  useLatticeScene: vi.fn(),
}));

const ratio = createTestRatio(3n, 2n);

const scenePoints: readonly LatticeScenePoint[] = [
  {
    id: "ratio-1",
    rawInput: "3/2",
    ratio,
    labelRatio: ratio,
    position: { x: 1, y: 0, z: 0 },
    hasHigherPrimeFactors: false,
    radialSide: null,
  },
];

const sceneConnections: readonly LatticeSceneConnection[] = [];

const removeRatio = vi.fn();

describe("LatticeCanvas", () => {
  it("passes render-ready scene data to the lattice scene hook", () => {
    render(
      <LatticeCanvas
        scenePoints={scenePoints}
        sceneConnections={sceneConnections}
        higherPrimeColor="purple"
        onPointRemove={removeRatio}
      />,
    );

    expect(useLatticeScene).toHaveBeenCalledWith(
      expect.objectContaining({ current: expect.any(HTMLDivElement) }),
      {
        scenePoints,
        sceneConnections,
        higherPrimeColor: "purple",
        onPointHover: expect.any(Function),
        onPointRemove: removeRatio,
      },
    );

    expect(
      screen.getByLabelText("Interactive ratio-lattice visualizer"),
    ).toBeInTheDocument();
  });

  it("shows the hovered ratio and its differing raw input", () => {
    const displayedRatio = createTestRatio(3n, 2n);

    const points = [
      {
        id: "ratio-1",
        rawInput: "3",
        ratio: displayedRatio,
        labelRatio: displayedRatio,
        position: { x: 1, y: 0, z: 0 },
        hasHigherPrimeFactors: false,
        radialSide: null,
      },
    ] satisfies readonly LatticeScenePoint[];

    render(
      <LatticeCanvas
        scenePoints={points}
        sceneConnections={sceneConnections}
        higherPrimeColor="purple"
        onPointRemove={removeRatio}
      />,
    );

    const options = vi.mocked(useLatticeScene).mock.lastCall?.[1];

    if (!options) {
      throw new Error("Expected useLatticeScene to be called");
    }

    act(() => {
      options.onPointHover({
        pointId: "ratio-1",
        clientX: 100,
        clientY: 100,
      });
    });

    expect(screen.getByText("3/2")).toBeInTheDocument();
    expect(screen.getByText("Entered as 3")).toBeInTheDocument();
  });

  it("does not repeat the raw input when it matches the displayed ratio", () => {
    render(
      <LatticeCanvas
        scenePoints={scenePoints}
        sceneConnections={sceneConnections}
        higherPrimeColor="purple"
        onPointRemove={removeRatio}
      />,
    );

    const options = vi.mocked(useLatticeScene).mock.lastCall?.[1];

    if (!options) {
      throw new Error("Expected useLatticeScene to be called");
    }

    act(() => {
      options.onPointHover({
        pointId: "ratio-1",
        clientX: 100,
        clientY: 100,
      });
    });

    expect(screen.getByText("3/2")).toBeInTheDocument();
    expect(screen.queryByText("Entered as 3/2")).not.toBeInTheDocument();
  });

  it("hides the tooltip when no lattice point is hovered", () => {
    render(
      <LatticeCanvas
        scenePoints={scenePoints}
        sceneConnections={sceneConnections}
        higherPrimeColor="purple"
        onPointRemove={removeRatio}
      />,
    );

    const options = vi.mocked(useLatticeScene).mock.lastCall?.[1];

    if (!options) {
      throw new Error("Expected useLatticeScene to be called");
    }

    act(() => {
      options.onPointHover({
        pointId: "ratio-1",
        clientX: 100,
        clientY: 100,
      });
    });

    expect(screen.getByText("3/2")).toBeInTheDocument();

    act(() => {
      options.onPointHover(null);
    });

    expect(screen.queryByText("Entered as 3/2")).not.toBeInTheDocument();
  });
});

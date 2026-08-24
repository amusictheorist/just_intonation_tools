// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { useLatticeScene } from "../hooks/useLatticeScene";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import type { LatticeSceneConnection } from "../../../lib/lattice/presentation/latticeSceneConnection";
import { render, screen } from "@testing-library/react";
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

describe("LatticeCanvas", () => {
  it("passes render-ready scene data to the lattice scene hook", () => {
    render(
      <LatticeCanvas
        scenePoints={scenePoints}
        sceneConnections={sceneConnections}
        higherPrimeColor="purple"
      />,
    );

    expect(useLatticeScene).toHaveBeenCalledWith(
      expect.objectContaining({ current: expect.any(HTMLDivElement) }),
      { scenePoints, sceneConnections, higherPrimeColor: "purple" },
    );

    expect(
      screen.getByLabelText("Interactive ratio-lattice visualizer"),
    ).toBeInTheDocument();
  });
});

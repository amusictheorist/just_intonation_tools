import { useRef } from "react";
import type {
  LatticeControls,
  PlacementMode,
  Ratio,
} from "../../../lib/lattice/types";
import { useSceneManager } from "../hooks/useSceneManager";

type LatticeCanvasProps = {
  ratios: Ratio[];
  mode: PlacementMode;
  controls: LatticeControls;
  removeRatio: (id: string) => void;
};

function LatticeCanvas({
  ratios,
  mode,
  controls,
  removeRatio,
}: LatticeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useSceneManager(containerRef, {
    ratios,
    mode,
    controls,
    removeRatio,
  });

  return (
    <div
      ref={containerRef}
      aria-label="Interactive ratio lattice"
      className="relative h-[32rem] w-full overflow-hidden rounded-lg bg-gray-100 sm:h-[38rem]"
    />
  );
}

export default LatticeCanvas;

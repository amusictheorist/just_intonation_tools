import { useRef } from "react";
import { useSceneManager } from "../hooks/useSceneManager";

const LatticeCanvas = ({ ratios, mode, controls, removeRatio }) => {
  const containerRef = useRef(null);

  useSceneManager(containerRef, { ratios, mode, controls, removeRatio });

  return (
    <div
      ref={containerRef}
      className="w-full h-[600px] bg-gray-100 rounded relative"
    />
  );
};

export default LatticeCanvas;

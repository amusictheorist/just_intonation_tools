import { useSpiral } from "../../hooks/useSpiral"
import InfoPanel from "./InfoPanel";
import NumberInput from "./NumberInput";
import SpiralCanvas from "./SpiralCanvas";

const SpiralPage = () => {
  const { addPoint, selected, svgGroupRef, pathRef } = useSpiral();

  return (
    <div className="pt-[100px] px-8 py-12 text-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Harmonic Spiral</h1>
      <NumberInput onAdd={addPoint} />
      <div className="grid grid-cols-2">
        <div className="bg-white">
          <SpiralCanvas svgGroupRef={svgGroupRef} pathRef={pathRef} />
        </div>
        <InfoPanel selected={selected} />
      </div>
    </div>
  );
};

export default SpiralPage;
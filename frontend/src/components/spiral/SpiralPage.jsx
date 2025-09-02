import { useSpiral } from "../../hooks/useSpiral"
import InfoPanel from "./InfoPanel";
import NumberInput from "./NumberInput";
import SpiralCanvas from "./SpiralCanvas";

const SpiralPage = () => {
  const { addPoint, selected, svgGroupRef, pathRef } = useSpiral();

  return (
    <div className="pt-[100px] px-8 py-12 text-center bg-gray-50">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Harmonic Spiral</h1>
        <NumberInput onAdd={addPoint} />
      </header>
      <div className="w-full max-w-[1200px] mx-auto md:grid md:grid-cols-2 gap-8 items-start">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-center">
          <SpiralCanvas svgGroupRef={svgGroupRef} pathRef={pathRef} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <InfoPanel selected={selected} />
        </div>
      </div>
    </div>
  );
};

export default SpiralPage;
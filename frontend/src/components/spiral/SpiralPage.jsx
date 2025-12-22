import { useState } from "react";
import { useSpiral } from "../../hooks/useSpiral"
import InfoPanel from "./InfoPanel";
import NumberInput from "./NumberInput";
import SpiralCanvas from "./SpiralCanvas";
import Modal from "./Modal";

const SpiralPage = () => {
  const {
    values,
    batches,
    selected,
    setSelected,
    addPointBatch,
    removeValue,
    undoLastBatch,
    resetToOne,
    svgGroupRef,
    pathRef
  } = useSpiral();
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleClear = () => setSelected(new Set());

  return (
    <div>
      <div className="pt-[100px] px-8 py-12 text-center bg-gray-50">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Harmonic Spiral</h1>
          <NumberInput onAdd={addPointBatch} />
          <button onClick={undoLastBatch} className="px-4 py-2 bg-yellow-500 text-white rounded">Undo</button>
          <button onClick={() => removeValue(selected.values().next().value)} className="px-4 py-2 bg-red-500 text-white rounded">Remove Selected</button>
          <button onClick={resetToOne} className="px-4 py-2 bg-gray-500 text-white rounded">Reset</button>
        </header>
        <div className="w-full max-w-[1200px] mx-auto md:grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-center">
            <SpiralCanvas svgGroupRef={svgGroupRef} pathRef={pathRef} values={values} selected={selected} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200 w-full">
            <InfoPanel selected={selected} onClear={handleClear} />
          </div>
        </div>
      </div>
      <button className="fixed bottom-5 right-5 w-12 h-12 bg-blue-600 text-white text-2xl rounded-full flex items-center justify-center shadow-md hover:bg-blue-800" onClick={toggleModal}>
        ℹ️
      </button>

      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={toggleModal} />
      )}
    </div>
  );
};

export default SpiralPage;
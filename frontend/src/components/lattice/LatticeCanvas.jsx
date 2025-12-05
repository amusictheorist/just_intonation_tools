const LatticeCanvas = ({ ratios, mode }) => {
  return (
    <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center rounded">
      <p className="text-gray-500">
        Lattice Visualization (mode: {mode})
        <br />
        {ratios.length} ratios loaded
      </p>
    </div>
  );
};

export default LatticeCanvas;
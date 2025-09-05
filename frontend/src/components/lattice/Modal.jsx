const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-5 max-w-sm w-11/12 rounded-lg shadow-lg text-left">
        <h2 className="text-xl font-bold mb-3">About the Lattice Generator</h2>
        <p className="mb-2">
          This 3D lattice generator arranges ratios as spheres on a lattice based on their prime factorizations.
        </p>
        <p className="mb-2">
          It uses a combination of cubic and radial positioning to place ratios in 3D space. As is traditionally done in musical ratio theory, I've mapped primes 3, 5, and 7 to the x, y, and z axes respectively, and these are the primary intervals shown through lines.
        </p>
        <p className="mb-2">
          I am experimenting with placing prime ratios above 7, since it introduces a fourth spatial dimension, which is always an issue on a 2D sheet of paper. But here, in 3D space, I'm using higher primes and the golden ratio to distribute ratios on an imaginary sphere around the central 1/1 ratio ensuring that prime ratios are uniquely placed, but not on the cubic lattice.
        </p>
        <p className="mb-2">
          I've added sliders to change the radius of the imaginary sphere and the radial angles of higher primes so that one can move them around for better visualization. It is also possible to change to color of the radial spheres so they contrast more against the spheres on the cubic lattice.
        </p>
        <button
          onClick={onClose}
          className="mt-5 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 max-w-2xl w-11/12 rounded-lg shadow-lg text-left">
        <h2 className="text-xl font-bold mb-4">About the Harmonic Spiral</h2>

        <p className="mb-4">
          The harmonic spiral is a logarithmic spiral where integers are placed to represent the partials of a harmonic series. It provides a visual way to explore harmonic relationships, octaves, and equivalence classes.
        </p>

        <h3 className="font-semibold mb-2">How to Use</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
          <li>
            <strong>Add partials:</strong> Enter one or more integers in the input box to draw those partials on the spiral. The spiral will extend as far as the highest integer entered. The limit is set at 1024 for now.
          </li>
          <li>
            <strong>Octave lines:</strong> A dotted line extends from partial 1 through powers of 2, showing octaves. Imagine similar lines for each odd partial—partials on the same line are octave equivalent and belong in the same <em>partial-class</em>.
          </li>
          <li>
            <strong>Select partials:</strong> Click any drawn partials to select them. Multiple selections are allowed.
          </li>
          <li>
            <strong>Explore the info panel:</strong> The info panel displays details about your selection, including:
            <ul className="list-disc list-inside ml-5">
              <li>Literal sets and their set classes</li>
              <li>Spectral extension values</li>
              <li>Interval matrices (pitch & pitch-class)</li>
              <li>Subsets of your chosen set</li>
            </ul>
          </li>
          <li>
            <strong>Clear selections:</strong> Use the “Clear” button in the info panel to clear all selected partials.
          </li>
        </ul>

        <button
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
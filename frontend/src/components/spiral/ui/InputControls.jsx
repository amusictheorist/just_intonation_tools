import { useState } from "react";

const InputControls = ({
  onAdd,
  onUndo,
  onRemoveSelected,
  onReset,
  hasSelection
}) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const parseInput = input => {
    const normalized = input.replace(/[–—]/g, "-");
    const tokens = normalized.split(/[,\s]+/);
    const result = [];

    tokens.forEach(token => {
      if (!token) return;

      const rangeMatch = token.match(/^(\d+)-(\d+)$/);
      if (rangeMatch) {
        let a = parseInt(rangeMatch[1], 10);
        let b = parseInt(rangeMatch[2], 10);

        if (a > b) [a, b] = [b, a];

        for (let n = a; n <= b; n++) {
          result.push(n);
        }
        return;
      }

      const n = parseInt(token, 10);
      if (!isNaN(n)) {
        result.push(n);
      }
    });

    return result;
  };

  const handleSubmit = () => {
    if (!input.trim()) return;

    const numbers = parseInput(input);
    
    const validNumbers = numbers.filter(n => n > 0 && n <= 1024);

    if (validNumbers.length === 0) {
      setError('Please enter integers or ranges between 1 and 1024');
      return;
    }

    onAdd(validNumbers);

    setInput('');
    setError('');
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter Partial(s), e.g. 3, 5 7"
          className="vorder rounded px-3 py-2 text-sm w-64"
        />

        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
        >
          Add
        </button>

        <button
          onClick={onUndo}
          className="px-4 py-2 bg-yellow-50 text-white rounded hover:bg-yellow-600 transition"
        >
          Undo
        </button>

        <button
          onClick={onRemoveSelected}
          disabled={!hasSelection}
          className={`px-4 py-2 rounded text-white transition ${hasSelection
              ? "bg-red-500 hover:bg-red-600"
              : "bg-red-300 cursor-not-allowed"
            }`}
        >
          Remove Selected
        </button>

        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          Reset
        </button>
      </div>
        
      {error && <p className="text-red-600 text-sm">{error}</p>}

    </div>
  );
};

export default InputControls;
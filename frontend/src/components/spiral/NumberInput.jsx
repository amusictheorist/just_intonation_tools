import { useState } from "react";

const NumberInput = ({ onAdd }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!input.trim()) return;

    const numbers = input
      .split(/[ ,]+/)
      .map((n) => parseInt(n, 10))
      .filter((n) => !isNaN(n));
    
    const validNumbers = numbers.filter((n) => n > 0 && n <= 1024);

    if (validNumbers.length === 0) {
      setError('Please enter integers between 1 and 1024.');
      return;
    }

    validNumbers.forEach((n) => onAdd(n));
    setInput('');
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      <input
        type="text"
        value={input}
        onChange={(e => setInput(e.target.value))}
        onKeyDown={handleKeyDown}
        placeholder="Enter partial(s), e.g. 3, 5 7"
        className="border rounded px-3 py-2 text-sm w-64"
      />
      <button
        onClick={handleSubmit}
        className="p-3 px-6 text-lg bg-green-600 text-white font-semibold rounded-md transition hover:bg-green-700 hover:underline"
      >
        Add
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default NumberInput;

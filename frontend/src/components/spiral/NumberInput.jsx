import { useState } from "react"

const NumberInput = ({ onAdd }) => {
  const [value, setValue] = useState('');

  return (
    <div>
      <input
        type="number"
        min='1'
        placeholder="Enter a positive integer"
        value={value}
        onChange={(e => setValue(e.target.value))}
        className="p-3 text-base border border-gray-300 rounded-md w-72"
      />
      <button
        onClick={() => {
          if (value) onAdd(parseInt(value));
          setValue('');
        }}
        className="p-3 px-6 text-lg bg-green-600 text-white font-semibold rounded-md transition hover:bg-green-700 hover:underline"
      >
        Add
      </button>
    </div>
  );
};

export default NumberInput;
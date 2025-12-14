import { useState } from "react";

const RatioInput = ({ onAdd }) => {
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (!value.trim()) return;
    onAdd(value);
    setValue('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="flex gap-2">
      <input
        className="border px-3 py-2 rounded w-64 text-sm h-10"
        type="text"
        placeholder="Enter ratio (e.g. 3/2)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium h-10"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
};

export default RatioInput;
import { useState, type KeyboardEvent } from "react";

type RatioInputProps = {
  onAdd: (value: string) => void;
};

function RatioInput({ onAdd }: RatioInputProps) {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    onAdd(trimmedValue);
    setValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-1 gap-2">
      <label htmlFor="ratio-input" className="sr-only">
        Ratio
      </label>

      <input
        id="ratio-input"
        className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
        type="text"
        placeholder="Enter ratio, such as 3/2"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button
        type="button"
        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
}

export default RatioInput;

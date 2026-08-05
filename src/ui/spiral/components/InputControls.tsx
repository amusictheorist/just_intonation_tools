import { useState, type KeyboardEvent } from "react";
import { parsePartialInput } from "../../../lib/spiral/parsePartialInput";

type InputControlsProps = {
  onAdd: (values: number[]) => void;
  onUndo: () => void;
  onRemoveSelected: () => void;
  onReset: () => void;
  hasSelection: boolean;
};

function InputControls({
  onAdd,
  onUndo,
  onRemoveSelected,
  onReset,
  hasSelection,
}: InputControlsProps) {
  const [input, setInput] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (): void => {
    if (!input.trim()) {
      return;
    }

    const result = parsePartialInput(input);

    if (result.valid === false) {
      setError(result.error);
      return;
    }

    onAdd(result.values);
    setInput("");
    setError(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    handleSubmit();
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        <label htmlFor="spiral-partial-input" className="sr-only">
          Partials or partial ranges
        </label>

        <input
          id="spiral-partial-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Partials, e.g. 3, 5 7 or 8–16"
          aria-describedby={error ? "spiral-input-error" : undefined}
          className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 md:min-w-64"
        />

        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-md bg-green-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          Add
        </button>

        <button
          type="button"
          onClick={onUndo}
          className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          Undo
        </button>

        <button
          type="button"
          onClick={onRemoveSelected}
          disabled={!hasSelection}
          className={[
            "rounded-md px-4 py-2 text-sm font-semibold text-white transition",
            hasSelection
              ? "bg-red-600 hover:bg-red-700"
              : "cursor-not-allowed bg-red-300",
          ].join(" ")}
        >
          Remove selected
        </button>

        <button
          type="button"
          onClick={onReset}
          className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
        >
          Reset
        </button>
      </div>

      {error && (
        <p
          id="spiral-input-error"
          role="alert"
          className="text-sm text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default InputControls;

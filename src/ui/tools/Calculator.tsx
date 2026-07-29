import { useState } from "react";
import ContentCard from "../layout/ContentCard";
import PageHeader from "../layout/PageHeader";
import PageLayout from "../layout/PageLayout";

function Calculator() {
  const [userInput, setUserInput] = useState("");
  const [transposeValue, setTransposeValue] = useState("");

  return (
    <PageLayout>
      <PageHeader
        title="Set Calculator"
        description="Enter a set of partials to calculate its properties."
      />

      <ContentCard>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label
              htmlFor="partial-set-input"
              className="block text-sm font-semibold text-gray-800"
            >
              Partial set
            </label>

            <input
              id="partial-set-input"
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="For example: 4, 5, 6"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled
            className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Calculate
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Calculator operations will be restored when the JI domain logic has
          been rebuilt in TypeScript.
        </p>
      </ContentCard>

      <ContentCard>
        <h2 className="text-2xl font-bold text-gray-900">Results</h2>

        <p className="mt-4 text-gray-600">
          Calculated set properties will appear here.
        </p>
      </ContentCard>

      <ContentCard>
        <h2 className="text-2xl font-bold text-gray-900">Transpose your set</h2>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label
              htmlFor="transpose-input"
              className="block text-sm font-semibold text-gray-800"
            >
              Transposition value
            </label>

            <input
              id="transpose-input"
              type="number"
              value={transposeValue}
              onChange={(e) => setTransposeValue(e.target.value)}
              placeholder="Enter a positive integer"
              disabled
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled
            className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Transpose
          </button>
        </form>
      </ContentCard>
    </PageLayout>
  );
}

export default Calculator;

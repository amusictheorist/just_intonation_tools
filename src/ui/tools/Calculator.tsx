import { useState } from "react";
import ContentCard from "../layout/ContentCard";
import PageHeader from "../layout/PageHeader";
import PageLayout from "../layout/PageLayout";
import type {
  CalculatorResult,
  TransposedCalculatorResult,
} from "../../lib/calculator/types";
import { parsePartialSetInput } from "../../lib/calculator/parsePartialSetInput";
import { buildCalculatorResult } from "../../lib/calculator/buildCalculatorResult";
import CalculatorResultGroup from "../calculator/components/CalculatorResultGroup";
import { transposeCalculatorResult } from "../../lib/calculator/transposeCalculatorResult";
import SetDisplay from "../calculator/components/SetDisplay";
import IntervalMatrixSection from "../calculator/components/IntervalMatrixSection";
import { createPositiveInteger } from "../../lib/ji/integer/positiveInteger";

function Calculator() {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [transposeValue, setTransposeValue] = useState("");
  const [transposedResult, setTransposedResult] =
    useState<TransposedCalculatorResult | null>(null);
  const [transposeError, setTransposeError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCalculate() {
    try {
      const partialSet = parsePartialSetInput(userInput);
      const calculatorResult = buildCalculatorResult(partialSet);

      setResult(calculatorResult);

      setTransposedResult(null);
      setTransposeValue("");
      setTransposeError(null);

      setError(null);
    } catch {
      setResult(null);
      setTransposedResult(null);
      setError("Enter a valid set of positive integers.");
    }
  }

  function handleTranspose() {
    if (!result) return;

    try {
      const transposition = createPositiveInteger(BigInt(transposeValue));
      const nextResult = transposeCalculatorResult(
        result.partial.set,
        transposition,
      );

      setTransposedResult(nextResult);
      setTransposeError(null);
    } catch {
      setTransposedResult(null);
      setTransposeError("Enter a valid positive integer transposition value.");
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Set Calculator"
        description="Enter a set of partials to calculate its properties."
      />

      <ContentCard>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCalculate();
          }}
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
            className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Calculate
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      </ContentCard>

      <ContentCard>
        <h2 className="text-2xl font-bold text-gray-900">Results</h2>

        {result ? (
          <div className="mt-4 space-y-6">
            <CalculatorResultGroup
              title="Partial set"
              kind="partial"
              result={result.partial}
            />

            <CalculatorResultGroup
              title="Partial-class set"
              kind="partialClass"
              result={result.partialClass}
            />
          </div>
        ) : (
          <p className="mt-4 text-gray-600">
            Calculated set properties will appear here.
          </p>
        )}

        {result && <IntervalMatrixSection result={result} />}
      </ContentCard>

      <ContentCard>
        <h2 className="text-2xl font-bold text-gray-900">Transpose your set</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTranspose();
          }}
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
              disabled={!result}
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={!result}
            className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Transpose
          </button>
        </form>

        {transposeError && (
          <p className="mt-4 text-sm text-red-700">{transposeError}</p>
        )}

        {transposedResult && (
          <div className="mt-6 space-y-6">
            <p>
              Partial set:{" "}
              <SetDisplay
                value={transposedResult.partialSet}
                kind="partial"
                notation="set"
              />
            </p>

            <p>
              Partial-class set:{" "}
              <SetDisplay
                value={transposedResult.partialClassSet}
                kind="partialClass"
                notation="set"
              />
            </p>
          </div>
        )}
      </ContentCard>
    </PageLayout>
  );
}

export default Calculator;

import { useState } from "react";
import type { CalculatorResult } from "../../../lib/calculator/types";
import IntervalMatrix from "../../components/IntervalMatrix";
import { partialSetIntervalMatrix } from "../../../lib/ji/partialSetIntervalMatrix";
import { partialClassSetIntervalMatrix } from "../../../lib/ji/partialClassSetIntervalMatrix";

type IntervalMatrixSectionProps = {
  result: CalculatorResult;
};

function IntervalMatrixSection({ result }: IntervalMatrixSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="font-semibold text-gray-900"
      >
        {isOpen ? "Hide interval matrices" : "Show interval matrices"}
      </button>

      {isOpen && (
        <div className="mt-6 space-y-8">
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Partial-set interval matrix
            </h3>

            <IntervalMatrix
              members={result.partial.set.members}
              matrix={partialSetIntervalMatrix(result.partial.set)}
              kind="partial"
            />
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Partial-class-set interval matrix
            </h3>

            <IntervalMatrix
              members={result.partialClass.set.members}
              matrix={partialClassSetIntervalMatrix(result.partialClass.set)}
              kind="partialClass"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default IntervalMatrixSection;

import type { CalculatorResult } from "../../../lib/calculator/types";
import SetDisplay from "./SetDisplay";

type CalculatorResultGroupProps = {
  title: string;
  kind: "partial" | "partialClass";
  result: CalculatorResult["partial"] | CalculatorResult["partialClass"];
};

function CalculatorResultGroup({
  title,
  kind,
  result,
}: CalculatorResultGroupProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

      <div className="mt-2 space-y-2 text-gray-900">
        <p>
          Set: <SetDisplay value={result.set} kind={kind} notation="set" />
        </p>

        <p>
          Set class:{" "}
          <SetDisplay value={result.setClass} kind={kind} notation="setClass" />
        </p>

        <p>
          Low inverse:{" "}
          <SetDisplay value={result.lowInverse} kind={kind} notation="set" />
        </p>

        <p>
          Low-inverse set class:{" "}
          <SetDisplay
            value={result.lowInverseSetClass}
            kind={kind}
            notation="setClass"
          />
        </p>
      </div>
    </div>
  );
}

export default CalculatorResultGroup;

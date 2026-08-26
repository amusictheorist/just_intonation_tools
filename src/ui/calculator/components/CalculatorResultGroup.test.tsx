// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CalculatorResult } from "../../../lib/calculator/types";
import { createPartialSet } from "../../../lib/ji/set/partialSet";
import { createPartial } from "../../../lib/ji/partial/partial";
import CalculatorResultGroup from "./CalculatorResultGroup";

describe("CalculatorResultGroup", () => {
  it("renders a partial result group with the expected lables and notation", () => {
    const result: CalculatorResult["partial"] = {
      set: createPartialSet([
        createPartial(12n),
        createPartial(15n),
        createPartial(18n),
      ]),
      setClass: createPartialSet([
        createPartial(4n),
        createPartial(5n),
        createPartial(6n),
      ]),
      lowInverse: createPartialSet([
        createPartial(10n),
        createPartial(12n),
        createPartial(15n),
      ]),
      lowInverseSetClass: createPartialSet([
        createPartial(10n),
        createPartial(12n),
        createPartial(15n),
      ]),
    };

    const { container } = render(
      <CalculatorResultGroup
        title="Partial set"
        kind="partial"
        result={result}
      />,
    );

    expect(container).toHaveTextContent("Partial set");
    expect(container).toHaveTextContent("Set: {12, 15, 18}");
    expect(container).toHaveTextContent("Set class: [4, 5, 6]");
    expect(container).toHaveTextContent("Low inverse: {10, 12, 15}");
    expect(container).toHaveTextContent("Low-inverse set class: [10, 12, 15]");
  });
});

// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createPartialSet } from "../../lib/ji/set/partialSet";
import { createPartial } from "../../lib/ji/partial/partial";
import IntervalMatrix from "./IntervalMatrix";
import { partialSetIntervalMatrix } from "../../lib/ji/interval/partialSetIntervalMatrix";
import { createPartialClassSet } from "../../lib/ji/set/partialClassSet";
import { createPartialClass } from "../../lib/ji/partial/partialClass";
import { partialClassSetIntervalMatrix } from "../../lib/ji/interval/partialClassSetIntervalMatrix";

describe("IntervalMatrix", () => {
  it("renders partial-set headers and inverval ratios", () => {
    const partialSet = createPartialSet([
      createPartial(4n),
      createPartial(5n),
      createPartial(6n),
    ]);

    const { container } = render(
      <IntervalMatrix
        members={partialSet.members}
        matrix={partialSetIntervalMatrix(partialSet)}
        kind="partial"
      />,
    );

    expect(container).toHaveTextContent("4");
    expect(container).toHaveTextContent("5");
    expect(container).toHaveTextContent("6");

    expect(container).toHaveTextContent("1/1");
    expect(container).toHaveTextContent("5/4");
    expect(container).toHaveTextContent("3/2");
  });

  it("underlines partial-class row and column headers", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    const { container } = render(
      <IntervalMatrix
        members={partialClassSet.members}
        matrix={partialClassSetIntervalMatrix(partialClassSet)}
        kind="partialClass"
      />,
    );

    const underlinedHeaders = container.querySelectorAll("th u");

    expect(underlinedHeaders).toHaveLength(6);
  });
});

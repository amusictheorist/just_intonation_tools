// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { createPartialSet } from "../../../lib/ji/set/partialSet";
import { createPartial } from "../../../lib/ji/partial/partial";
import SetDisplay from "./SetDisplay";
import { createPartialClassSet } from "../../../lib/ji/set/partialClassSet";
import { createPartialClass } from "../../../lib/ji/partial/partialClass";

describe("SetDisplay", () => {
  it("renders a partial set with curly braces", () => {
    const partialSet = createPartialSet([
      createPartial(4n),
      createPartial(5n),
      createPartial(6n),
    ]);

    const { container } = render(
      <SetDisplay value={partialSet} kind="partial" notation="set" />,
    );

    expect(container).toHaveTextContent("{4, 5, 6}");
  });

  it("renders a partial-set class with square brackets", () => {
    const partialSet = createPartialSet([
      createPartial(4n),
      createPartial(5n),
      createPartial(6n),
    ]);

    const { container } = render(
      <SetDisplay value={partialSet} kind="partial" notation="setClass" />,
    );

    expect(container).toHaveTextContent("[4, 5, 6]");
  });

  it("renders a partial-class set with curly braces", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    const { container } = render(
      <SetDisplay value={partialClassSet} kind="partialClass" notation="set" />,
    );

    expect(container).toHaveTextContent("{1, 3, 5}");
  });

  it("underlines ever partial class", () => {
    const partialClassSet = createPartialClassSet([
      createPartialClass(1n),
      createPartialClass(3n),
      createPartialClass(5n),
    ]);

    const { container } = render(
      <SetDisplay
        value={partialClassSet}
        kind="partialClass"
        notation="setClass"
      />,
    );

    const underlinedMembers = container.querySelectorAll("u");

    expect(underlinedMembers).toHaveLength(3);
    expect(underlinedMembers[0]).toHaveTextContent("1");
    expect(underlinedMembers[1]).toHaveTextContent("3");
    expect(underlinedMembers[2]).toHaveTextContent("5");
  });
});

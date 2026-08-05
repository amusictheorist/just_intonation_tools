// @vitest-environment jsdom

import { screen } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

describe("DOM test infrastructure", () => {
  it("provides DOM assertions through jsdom and Testing Library", () => {
    document.body.innerHTML = `<button type="button">Test button</button>`;

    expect(
      screen.getByRole("button", { name: "Test button" }),
    ).toBeInTheDocument();
  });
});

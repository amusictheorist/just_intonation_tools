// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createLatticePointLabelSprite } from "./createLatticePointLabelSprite";

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect: vi.fn(),
    fillStyle: "",
    font: "",
    textAlign: "start",
    textBaseline: "alphabetic",
    fillText: vi.fn(),
  } as unknown as CanvasRenderingContext2D);
});

describe("createLatticePointLabelSprite", () => {
  it("creates a visible lattice point label sprite", () => {
    const sprite = createLatticePointLabelSprite("3/2");

    expect(sprite.material.opacity).toBe(1);
    expect(sprite.material.depthTest).toBe(false);
    expect(sprite.material.depthWrite).toBe(false);

    expect(sprite.scale.x).toBe(2);
    expect(sprite.scale.y).toBe(0.5);
    expect(sprite.scale.z).toBe(1);
  });

  it("draws the supplied label text onto the canvas", () => {
    const fillText = vi.fn();

    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      clearRect: vi.fn(),
      fillStyle: "",
      font: "",
      textAlign: "start",
      textBaseline: "alphabetic",
      fillText,
    } as unknown as CanvasRenderingContext2D);

    createLatticePointLabelSprite("3/2");

    expect(fillText).toHaveBeenCalledWith("3/2", 256, 64);
  });

  it("throws when a canvas rendering context cannot be created", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    expect(() => createLatticePointLabelSprite("3/2")).toThrow(
      "Could not create label canvas context",
    );
  });
});

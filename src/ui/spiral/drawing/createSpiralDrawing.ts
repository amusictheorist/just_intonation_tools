import { polarToXY } from "../../../lib/spiral/math";
import {
  drawOctaveLines,
  drawSpiral,
  SVG_NAMESPACE,
} from "../drawing/spiralDrawing";

type ElementAccessors = {
  getGroupElement: () => SVGGElement | null;
  getPathElement: () => SVGPathElement | null;
};

export type SpiralDrawing = {
  drawPoint: (value: number, theta: number, onToggle?: () => void) => void;
  extendSpiral: (oldTheta: number, newTheta: number) => void;
  shrinkSpiralTo: (newTheta: number) => void;
  removeValueVisual: (value: number) => void;
  clearExceptOne: () => void;
};

export const createSpiralDrawing = (
  accessors: ElementAccessors,
  radiusPerOctave: number,
): SpiralDrawing => {
  const getElements = () => {
    const groupElement = accessors.getGroupElement();

    const pathElement = accessors.getPathElement();

    if (!groupElement || !pathElement) {
      return null;
    }

    return {
      groupElement,
      pathElement,
    };
  };

  const drawPoint = (
    value: number,
    theta: number,
    onToggle?: () => void,
  ): void => {
    const elements = getElements();

    if (!elements) {
      return;
    }

    const { groupElement } = elements;
    const radius = radiusPerOctave * Math.log2(value);

    const { x, y } = polarToXY(radius, theta);

    const dot = document.createElementNS(SVG_NAMESPACE, "circle");

    dot.setAttribute("cx", x.toString());
    dot.setAttribute("cy", y.toString());
    dot.setAttribute("r", "4");
    dot.setAttribute("fill", "black");
    dot.setAttribute("data-value", value.toString());
    dot.setAttribute("tabindex", "0");
    dot.setAttribute("role", "button");
    dot.setAttribute("aria-label", `Partial ${value}`);
    dot.setAttribute("focusable", "true");
    dot.style.cursor = "pointer";

    const toggle = (): void => {
      onToggle?.();
    };

    dot.addEventListener("click", (event) => {
      event.preventDefault();
      toggle();
    });

    dot.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });

    dot.addEventListener("focus", () => {
      dot.setAttribute("stroke", "#2563eb");
      dot.setAttribute("stroke-width", "2");
    });

    dot.addEventListener("blur", () => {
      dot.removeAttribute("stroke");
      dot.removeAttribute("stroke-width");
    });

    groupElement.appendChild(dot);

    const label = document.createElementNS(SVG_NAMESPACE, "text");

    let labelX: number;
    let labelY: number;

    if (value === 1) {
      labelX = x + 6;
      labelY = y - 6;
    } else {
      const magnitude = Math.sqrt(x * x + y * y) || 1;

      const unitX = x / magnitude;
      const unitY = y / magnitude;
      const offset = 14;

      labelX = x + unitX * offset;
      labelY = y + unitY * offset;
    }

    label.setAttribute("x", labelX.toString());
    label.setAttribute("y", labelY.toString());
    label.setAttribute("font-size", "10");
    label.setAttribute("data-value", value.toString());
    label.textContent = value.toString();

    groupElement.appendChild(label);
  };

  const extendSpiral = (oldTheta: number, newTheta: number): void => {
    const elements = getElements();

    if (!elements) {
      return;
    }

    drawSpiral({
      pathElement: elements.pathElement,
      thetaStart: oldTheta,
      thetaEnd: newTheta,
      animate: true,
      radiusPerOctave,
    });

    drawOctaveLines({
      groupElement: elements.groupElement,
      maxTheta: newTheta,
      radiusPerOctave,
    });
  };

  const shrinkSpiralTo = (newTheta: number): void => {
    const elements = getElements();

    if (!elements) {
      return;
    }

    const { groupElement, pathElement } = elements;

    pathElement.setAttribute("d", "");

    groupElement.querySelectorAll(".octave-line").forEach((element) => {
      element.remove();
    });

    if (newTheta <= 0) {
      return;
    }

    drawSpiral({
      pathElement,
      thetaStart: 0,
      thetaEnd: newTheta,
      animate: true,
      radiusPerOctave,
    });

    drawOctaveLines({
      groupElement,
      maxTheta: newTheta,
      radiusPerOctave,
    });
  };

  const removeValueVisual = (value: number): void => {
    const groupElement = accessors.getGroupElement();

    if (!groupElement) {
      return;
    }

    groupElement
      .querySelectorAll(`[data-value="${value}"]`)
      .forEach((element) => {
        element.remove();
      });
  };

  const clearExceptOne = (): void => {
    const elements = getElements();

    if (!elements) {
      return;
    }

    elements.groupElement
      .querySelectorAll(
        [
          'circle[data-value]:not([data-value="1"])',
          'text[data-value]:not([data-value="1"])',
          ".octave-line",
        ].join(", "),
      )
      .forEach((element) => {
        element.remove();
      });

    elements.pathElement.setAttribute("d", "");
  };

  return {
    drawPoint,
    extendSpiral,
    shrinkSpiralTo,
    removeValueVisual,
    clearExceptOne,
  };
};

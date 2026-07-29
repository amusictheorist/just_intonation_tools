import type { LatticePointData } from "./types";

export class TooltipSystem {
  private readonly element: HTMLDivElement | null;

  constructor(id = "lattice-tooltip") {
    this.element = document.getElementById(id) as HTMLDivElement | null;
  }

  show(data: LatticePointData, x: number, y: number): void {
    if (!this.element) {
      return;
    }

    this.element.replaceChildren();

    this.element.append(
      this.createRow("Input", data.rawInput ?? ""),
      this.createRow("Placed", data.octaveLabel ?? ""),
    );

    if (
      data.rawValue !== null &&
      data.octaveValue !== null &&
      data.rawValue > 0 &&
      data.octaveValue > 0
    ) {
      const octaveShift = Math.log2(data.rawValue / data.octaveValue);

      this.element.append(
        this.createRow("Octave shift", octaveShift.toString()),
      );
    }

    this.element.style.left = `${x + 10}px`;
    this.element.style.top = `${y + 10}px`;
    this.element.style.display = "block";
  }

  hide(): void {
    if (this.element) {
      this.element.style.display = "none";
    }
  }

  private createRow(label: string, value: string): HTMLDivElement {
    const row = document.createElement("div");
    const heading = document.createElement("strong");

    heading.textContent = `${label}: `;
    row.append(heading, value);

    return row;
  }
}

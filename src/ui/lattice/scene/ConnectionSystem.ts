import * as THREE from "three";
import { reduceFraction } from "../../../lib/lattice/math/fractions";
import type { PrimeFactors } from "../../../lib/lattice/math/factors";
import type { ConnectionLine, LatticePointMesh } from "./types";

export class ConnectionSystem {
  readonly scene: THREE.Scene;
  lines: ConnectionLine[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  clear(): void {
    for (const line of this.lines) {
      this.scene.remove(line);
      line.geometry.dispose();
      line.material.dispose();
    }

    this.lines = [];
  }

  rebuild(points: LatticePointMesh[]): void {
    this.clear();

    if (points.length === 0) {
      return;
    }

    const radialMode = points.some(
      (point) => point.userData.latticeType === "radial",
    );

    if (radialMode) {
      this.connectRadial(points);
      return;
    }

    const groups = this.groupByLattice(points);

    for (const [key, group] of groups) {
      this.connectGroup(group);

      if (key !== "global") {
        const anchor = group.find((point) => {
          const lattice = point.userData.lattice;

          return (
            Array.isArray(lattice) &&
            lattice.length === 3 &&
            lattice.every(
              (coordinate) =>
                typeof coordinate === "number" && coordinate === 0,
            )
          );
        });

        const center = points[0];

        if (anchor && center) {
          this.lines.push(this.createLine(anchor, center));
        }
      }
    }
  }

  update(): void {
    for (const line of this.lines) {
      line.geometry.setFromPoints([
        line.userData.p1.position,
        line.userData.p2.position,
      ]);
    }
  }

  private factorsToFraction(factors: PrimeFactors): {
    num: number;
    den: number;
  } {
    let numerator = 1;
    let denominator = 1;

    for (const [prime, exponent] of factors) {
      if (exponent > 0) {
        numerator *= prime ** exponent;
      }

      if (exponent < 0) {
        denominator *= prime ** -exponent;
      }
    }

    return reduceFraction(numerator, denominator);
  }

  private connectRadial(points: LatticePointMesh[]): void {
    if (points.length < 2) {
      return;
    }

    const pointMap = new Map<string, LatticePointMesh>();

    for (const point of points) {
      const key = point.userData.canonicalKey;

      if (key) {
        pointMap.set(key, point);
      }
    }

    const center = points[0];

    for (const point of points) {
      const canonicalKey = point.userData.canonicalKey;
      const factors = point.userData.factors;

      if (!canonicalKey || !factors) {
        continue;
      }

      const entries = Array.from(factors.entries());

      if (entries.length === 1 && point !== center) {
        this.lines.push(this.createLine(center, point));
      }

      for (const [prime, exponent] of entries) {
        if (exponent === 0) {
          continue;
        }

        const sign = exponent > 0 ? 1 : -1;
        const neighborFactors = new Map(factors);

        neighborFactors.set(prime, exponent - sign);

        if (neighborFactors.get(prime) === 0) {
          neighborFactors.delete(prime);
        }

        const { num, den } = this.factorsToFraction(neighborFactors);

        const neighbor = pointMap.get(`${num}/${den}`);

        if (neighbor) {
          this.lines.push(this.createLine(neighbor, point));
        }
      }
    }
  }

  private groupByLattice(
    points: LatticePointMesh[],
  ): Map<string, LatticePointMesh[]> {
    const groups = new Map<string, LatticePointMesh[]>();

    for (const point of points) {
      const { latticeType, primeAnchor } = point.userData;

      const key =
        latticeType === "prime"
          ? (primeAnchor?.toString() ?? "unknown")
          : "global";

      const group = groups.get(key) ?? [];
      group.push(point);
      groups.set(key, group);
    }

    return groups;
  }

  private connectGroup(group: LatticePointMesh[]): void {
    for (let firstIndex = 0; firstIndex < group.length; firstIndex += 1) {
      for (
        let secondIndex = firstIndex + 1;
        secondIndex < group.length;
        secondIndex += 1
      ) {
        const first = group[firstIndex];
        const second = group[secondIndex];

        if (this.isCubicNeighbor(first, second)) {
          this.lines.push(this.createLine(first, second));
        }
      }
    }
  }

  private isCubicNeighbor(
    first: LatticePointMesh,
    second: LatticePointMesh,
  ): boolean {
    const firstLattice = first.userData.lattice;
    const secondLattice = second.userData.lattice;

    if (
      firstLattice.length !== 3 ||
      secondLattice.length !== 3 ||
      !firstLattice.every((value) => typeof value === "number") ||
      !secondLattice.every((value) => typeof value === "number")
    ) {
      return false;
    }

    const [firstX, firstY, firstZ] = firstLattice;
    const [secondX, secondY, secondZ] = secondLattice;

    const deltaX = Math.abs(firstX - secondX);
    const deltaY = Math.abs(firstY - secondY);
    const deltaZ = Math.abs(firstZ - secondZ);

    const differingAxes =
      Number(deltaX !== 0) + Number(deltaY !== 0) + Number(deltaZ !== 0);

    return differingAxes === 1;
  }

  private createLine(
    first: LatticePointMesh,
    second: LatticePointMesh,
  ): ConnectionLine {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      first.position,
      second.position,
    ]);

    const material = new THREE.LineBasicMaterial({
      color: 0x888888,
      transparent: true,
      opacity: 0.85,
    });

    const line = new THREE.Line(geometry, material) as ConnectionLine;

    line.userData = {
      p1: first,
      p2: second,
    };

    this.scene.add(line);

    return line;
  }
}

import * as THREE from 'three';
import { reduceFraction } from '../utils/math/helpers';

export class ConnectionSystem {
  constructor(scene) {
    this.scene = scene;
    this.lines = [];
  }

  clear() {
    this.lines.forEach(line => this.scene.remove(line));
    this.lines = [];
  }

  rebuild(points) {
    this.clear();

    if (points.length === 0) return;

    const radialMode = points.some(
      p => p.userData.latticeType === 'radial'
    );

    if (radialMode) {
      this._connectRadial(points);
      return;
    }

    const groups = this._groupByLattice(points);
    for (const [key, group] of groups) {
      this._connectGroup(group);

      if (key !== 'global') {
        const anchor = group.find(p => p.userData.lattice?.every(n => n === 0));
        const center = points[0];

        if (anchor && center) {
          this.lines.push(this._createLine(anchor, center));
        }
      }
    }
  }

  update() {
    for (const line of this.lines) {
      line.geometry.setFromPoints([
        line.userData.p1.position,
        line.userData.p2.position
      ]);
      line.geometry.verticesNeedUpdate = true;
    }
  }

  _connectRadial(points) {
    if (points.length < 2) return;

    const factorsToFraction = factors => {
      let num = 1;
      let den = 1;

      for (const [p, e] of factors.entries()) {
        if (e > 0) num *= p ** e;
        if (e < 0) den *= p ** (-e);
      }

      const reduced = reduceFraction(num, den);
      return reduced;
    };

    const map = new Map();
    for (const p of points) {
      if (!p.userData?.canonicalKey) continue;
      map.set(p.userData.canonicalKey, p);
    }

    const center = points[0];

    for (const p of points) {
      if (!p.userData?.canonicalKey) continue;
      const factors = p.userData.factors;
      if (!factors) continue;

      const entries = Array.from(factors.entries());

      if (entries.length === 1 && p !== center) {
          this.lines.push(this._createLine(center, p));
      }

      for (const [prime, exp] of entries) {
        if (exp === 0) continue;
        const sign = exp > 0 ? +1 : -1;

        const neighborFactors = new Map(factors);
        neighborFactors.set(prime, exp - sign);

        if (neighborFactors.get(prime) === 0) {
          neighborFactors.delete(prime);
        }

        const { num, den } = factorsToFraction(neighborFactors);
        const key = `${num}/${den}`;

        const neighbor = map.get(key);
        if (neighbor) {
          this.lines.push(this._createLine(neighbor, p))
        }
      }
    }
  }

  _groupByLattice(points) {
    const groups = new Map();

    for (const p of points) {
      const type = p.userData.latticeType;

      let key = 'global';
      if (type === 'prime') {
        key = p.userData.primeAnchor?.toString() ?? 'unknown';
      }

      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(p);
    }

    return groups;
  }

  _connectGroup(group) {
    const len = group.length;
    if (len < 2) return;

    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const p1 = group[i];
        const p2 = group[j];

        if (this._isCubicNeighbor(p1, p2)) {
          this.lines.push(this._createLine(p1, p2));
        }
      }
    }
  }

  _isCubicNeighbor(p1, p2) {
    const a = p1.userData.lattice;
    const b = p2.userData.lattice;

    if (!a || !b) return false;

    const dx = Math.abs(a[0] - b[0]);
    const dy = Math.abs(a[1] - b[1]);
    const dz = Math.abs(a[2] - b[2]);

    const diff = (dx !== 0) + (dy !== 0) + (dz !== 0);
    return diff === 1;
  }

  _createLine(p1, p2) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      p1.position,
      p2.position
    ]);

    const material = new THREE.LineBasicMaterial({
      color: 0x888888,
      transparent: true,
      opacity: 0.85
    });

    const line = new THREE.Line(geometry, material);
    line.userData = { p1, p2 };

    this.scene.add(line);
    return line;
  }
}
import * as THREE from 'three';

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
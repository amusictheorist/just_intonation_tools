import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class SceneManager {
  constructor(container) {
    // constructor method builds scene on initialization
    this.container = container;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf9fafb);

    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(10, 6, 14);
    this.camera.lookAt(0, 0, 0);
    
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);
    
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    this.scene.add(light);
    
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    this.points = [];
    this.connections = [];
    this.toRemove = [];

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove);
    this.renderer.domElement.addEventListener('click', this.onClick);

    this.addCenterPoint();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // animate method renders and animates scene
  animate() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    // fade-in for objects being added
    for (const p of this.points) {
      if (!p.material) continue;

      if (p.material.opacity < 1) {
        p.material.opacity = Math.min(1, p.material.opacity + 0.05, 1);
      }

      if (p.userData.labelSprite) {
        const mat = p.userData.labelSprite.material;
        mat.opacity = Math.min(mat.opacity + 0.05, 1);
      }
    }

    // fade-in for lines
    for (const line of this.connections) {
      if (!line.material) continue;
      if (line.material.opacity < 1) {
        line.material.opacity = Math.min(1, line.material.opacity + 0.05);
      }
    }

    // fade-out for items being removed
    for (let i = this.toRemove.length - 1; i >= 0; i--) {
      const obj = this.toRemove[i];

      if (obj.material) {
        obj.material.opacity -= 0.05;
      }

      if (obj.userData && obj.userData.labelSprite) {
        obj.userData.labelSprite.material.opacity -= 0.05;
      }

      if (obj.material && obj.material.opacity <= 0) {
        this.scene.remove(obj);

        if (obj.userData && obj.userData.labelSprite) {
          this.scene.remove(obj.userData.labelSprite);
        }

        this.toRemove.splice(i, 1);
      }
    }

    requestAnimationFrame(this.animate);
  }

  // reset lattice, keep lights, camera, and center point
  clearPoints() {
    const keep = new Set();
    keep.add(this.camera);

    this.scene.children.forEach(obj => {
      if (obj.isLight) keep.add(obj);
    });

    const center = this.points[0];
    keep.add(center);
    if (center.userData && center.userData.labelSprite) {
      keep.add(center.userData.labelSprite);
    }

    this.scene.children.slice().forEach(obj => {
      if (!keep.has(obj)) {
        this.scene.remove(obj);
      }
    });

    this.points = [center];
    for (let line of this.connections) {
      this.scene.remove(line);
    }
    this.connections = [];
    this.toRemove = [];
  }

  // method for adding spheres and labels
  addPoint(x, y, z, label = "", color = 0x3366ff, data = null) {
    const SPACING = 2;
    const geom = new THREE.SphereGeometry(0.2, 32, 32);
    const mat = new THREE.MeshStandardMaterial({
      color,
      transparent: true,
      opacity: 0
    });

    const sphere = new THREE.Mesh(geom, mat);
    sphere.position.set(x * SPACING, y * SPACING, z * SPACING);

    const lattice = data?.lattice ?? [x, y, z];
    const latticeType = data?.latticeType ?? 'global';
    const primeAnchor = data?.primeAnchor ?? null;

    sphere.userData = {
      id: data ? data.id : null,
      lattice,
      latticeType,
      rawInput: label,
      octaveLabel: label,
      rawValue: data ? data.canonical.value : null,
      octaveValue: data ? data.octave.value : null
    };

    this.scene.add(sphere);
    this.points.push(sphere);

    if (label) {
      const sprite = this.createLabel(label);
      sprite.position.set(x * SPACING, y * SPACING + 0.4, z * SPACING);
      sprite.material.opacity = 0;
      this.scene.add(sprite);
      sphere.userData.labelSprite = sprite;
    }

    for (const other of this.points) {
      if (other !== sphere && other.userData && Array.isArray(other.userData.lattice)) {
        this.connectIfVisible(
          { mesh: sphere, lattice: sphere.userData.lattice },
          { mesh: other, lattice: other.userData.lattice }
        );
      }
    }
  }

  // method for creating sphere labels
  createLabel(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';
    context.font = '64px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      opacity: 0
    });

    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(2, 0.5, 1);

    return sprite;
  }

  // loads lattice with center sphere already added
  addCenterPoint() {
    const geom = new THREE.SphereGeometry(0.2, 32, 32);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 1
    });

    const sphere = new THREE.Mesh(geom, mat);
    sphere.position.set(0, 0, 0);
    sphere.userData.lattice = [0, 0, 0];

    this.scene.add(sphere);
    this.points.push(sphere);

    const sprite = this.createLabel('1/1');
    sprite.position.set(0, 0.4, 0);
    sprite.material.opacity = 1;
    this.scene.add(sprite);

    sphere.userData.labelSprite = sprite;
  }

  // method draws lines between spheres in the scene
  connectIfVisible(p1, p2) {
    const [x1, y1, z1] = p1.lattice;
    const [x2, y2, z2] = p2.lattice;

    const sameX = x1 === x2;
    const sameY = y1 === y2;
    const sameZ = z1 === z2;

    const axesDifferent = (sameX ? 0 : 1) + (sameY ? 0 : 1) + (sameZ ? 0 : 1);
    if (axesDifferent !== 1) return;

    const geom = new THREE.BufferGeometry().setFromPoints([
      p1.mesh.position,
      p2.mesh.position
    ]);
    const mat = new THREE.LineBasicMaterial({
      color: 0x999999,
      transparent: true,
      opacity: 0
    });

    const line = new THREE.Line(geom, mat);

    this.scene.add(line);
    this.connections.push(line);
    mat.opacity = 0;
  }

  // onClick handler deletes spheres from scene
  onClick = event => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const candidates = this.points.filter(p => p !== this.points[0]);
    const intersects = this.raycaster.intersectObjects(candidates, false);
    if (intersects.length === 0) return;

    const hit = intersects[0].object;
    const id = hit.userData.id;
    if (!id) return;

    this.toRemove.push(hit);

    if (this.onRemove) {
      setTimeout(() => this.onRemove(id), 300);
    }
  }

  // method detects mouse movement for on hover events
  onMouseMove = event => {
    const rect = this.renderer.domElement.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const candidates = this.points.filter(p => p !== this.points[0]);
    const intersects = this.raycaster.intersectObjects(candidates, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      this.showTooltip(hit.userData, event.clientX, event.clientY);
    } else {
      this.hideTooltip();
    }
  }

  // method shows tooltip on mouse hover
  showTooltip(data, x, y) {
    const div = document.getElementById('lattice-tooltip');
    const [lx, ly, lz] = data.lattice || [0, 0, 0];
    
    let extra = ''
    if (data.rawValue && data.octaveValue) {
      const octaveShift = Math.log2(data.rawValue / data.octaveValue);
      extra = `<div><b>Octave shift:</b> ${octaveShift}</div>`;
    }

    const html = `
      <div><b>Input:</b> ${data.rawInput}</div>
      <div><b>Placed:</b> ${data.octaveLabel}</div>
      <div><b>Coordinates:</b> (${lx}, ${ly}, ${lz})</div>
      ${extra}
    `;

    div.innerHTML = html;
    div.style.left = `${x + 10}px`;
    div.style.top = `${y + 10}px`;
    div.style.display = 'block';
  }

  // hides tooltip after mouse hover
  hideTooltip() {
    const div = document.getElementById('lattice-tooltip');
    div.style.display = 'none';
  }

  // handles canvas resizing
  resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}
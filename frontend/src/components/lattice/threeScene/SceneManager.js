import * as THREE from "three";
import { fadeInLines, fadeInPoints, fadeOutRemoving } from "./FadeSystem";
import { InteractionSystem } from "./InteractionSystem";
import { CameraSystem } from "./CameraSystems";
import { createCenterPoint } from "./CenterPointSystem";
import { createPoint } from "./PointFactory";

export class SceneManager {
  constructor(container) {
    // constructor method builds scene on initialization
    this.container = container;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf9fafb);

    this.cameraSystem = new CameraSystem(this.renderer.domElement);
    this.camera = this.cameraSystem.camera;
    this.controls = this.cameraSystem.controls;

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    this.scene.add(light);

    this.points = [];
    this.connections = [];
    this.toRemove = [];

    this.interactions = new InteractionSystem(this);

    createCenterPoint(this.scene, this.points);

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // animate method renders and animates scene
  animate() {
    this.cameraSystem.update();

    fadeInPoints(this.points);
    fadeInLines(this.connections);
    fadeOutRemoving(this.toRemove, this.scene);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }

  // method for adding spheres and labels
  addPoint(x, y, z, label, color, data) {
    const mesh = createPoint({ x, y, z, label, color, data });
    this.scene.add(mesh);
    this.points.push(mesh);

    if (mesh.userData.labelSprite) {
      this.scene.add(mesh.userData.labelSprite);
    }
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

  // addPoint(x, y, z, label = "", color = 0x3366ff, data = null) {
  //   const SPACING = 2;
  //   const geom = new THREE.SphereGeometry(0.2, 32, 32);
  //   const mat = new THREE.MeshStandardMaterial({
  //     color: new THREE.Color(color),
  //     transparent: true,
  //     opacity: 0
  //   });

  //   const sphere = new THREE.Mesh(geom, mat);
  //   sphere.position.set(x * SPACING, y * SPACING, z * SPACING);

  //   const lattice = data?.lattice ?? [x, y, z];
  //   const latticeType = data?.latticeType ?? 'global';

  //   sphere.userData = {
  //     id: data ? data.id : null,
  //     ratio: data,
  //     lattice,
  //     latticeType,
  //     rawInput: data?.rawInput ?? null,
  //     octaveLabel: data?.octaveLabel ?? label,
  //     rawValue: data?.canonical?.value ?? null,
  //     octaveValue: data?.octave?.value ?? null
  //   };

  //   this.scene.add(sphere);
  //   this.points.push(sphere);

  //   if (label) {
  //     const sprite = createLabel(label);
  //     sprite.position.set(x * SPACING, y * SPACING + 0.4, z * SPACING);
  //     sprite.material.opacity = 0;
  //     this.scene.add(sprite);
  //     sphere.userData.labelSprite = sprite;
  //   }

  //   // for (const other of this.points) {
  //   //   if (other !== sphere && other.userData && Array.isArray(other.userData.lattice)) {
  //   //     this.connectIfVisible(
  //   //       { mesh: sphere, lattice: sphere.userData.lattice },
  //   //       { mesh: other, lattice: other.userData.lattice }
  //   //     );
  //   //   }
  //   // }
  // }

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

  // method shows tooltip on mouse hover
  showTooltip(data, x, y) {
    const div = document.getElementById('lattice-tooltip');
    
    let extra = ''
    if (data.rawValue && data.octaveValue) {
      const octaveShift = Math.log2(data.rawValue / data.octaveValue);
      extra = `<div><b>Octave shift:</b> ${octaveShift}</div>`;
    }

    const html = `
      <div><b>Input:</b> ${data.rawInput}</div>
      <div><b>Placed:</b> ${data.octaveLabel}</div>
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
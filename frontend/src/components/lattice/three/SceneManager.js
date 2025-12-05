import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class SceneManager {
  constructor(container) {
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
    this.camera.position.set(0, 0, 20);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    this.scene.add(light);

    this.points = [];

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  animate() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }

  clearPoints() {
    this.points.forEach(p => this.scene.remove(p));
    this.points = [];
  }

  addPoint(x, y, z, color = 0x3366ff) {
    const geom = new THREE.SphereGeometry(0.15, 12, 12);
    const mat = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(x, y, z);
    this.scene.add(mesh);
    this.points.push(mesh);
  }

  resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}
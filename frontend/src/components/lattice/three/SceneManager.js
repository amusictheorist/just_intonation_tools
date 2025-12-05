import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
    this.camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    this.scene.add(light);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.points = [];

    this.addCenterPoint();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  animate() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }

  clearPoints() {
    this.points.forEach(p => {
      if (p.userData.label !== "1/1") {
        this.scene.remove(p);
      }
    });

    this.points = this.points.filter(p => p.userData.label === "1/1");
  }

  addPoint(x, y, z, color = 0x3366ff, label = "") {
    const geom = new THREE.SphereGeometry(0.2, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ color });
    const sphere = new THREE.Mesh(geom, mat);

    sphere.position.set(x, y, z);
    sphere.userData.label = label;

    this.scene.add(sphere);
    this.points.push(sphere);
  }

  addCenterPoint() {
    const geom = new THREE.SphereGeometry(0.2, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geom, mat);

    sphere.position.set(0, 0, 0);
    sphere.userData.label = "1/1";

    this.scene.add(sphere);
    this.points.push(sphere);
  }

  resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}

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
  }

  addPoint(x, y, z, label = "", color = 0x3366ff) {
    const SPACING = 2;
    const geom = new THREE.SphereGeometry(0.2, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ color });
    const sphere = new THREE.Mesh(geom, mat);
    sphere.position.set(x * SPACING, y * SPACING, z * SPACING);

    this.scene.add(sphere);
    this.points.push(sphere);

    if (label) {
      const sprite = this.createLabel(label);
      sprite.position.set(x * SPACING, y * SPACING + 0.4, z * SPACING);
      this.scene.add(sprite);
      sphere.userData.labelSprite = sprite;
    }
  }

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
      depthWrite: false
    });

    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(2, 0.5, 1);

    return sprite;
  }

  addCenterPoint() {
    const geom = new THREE.SphereGeometry(0.2, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geom, mat);

    sphere.position.set(0, 0, 0);

    this.scene.add(sphere);
    this.points.push(sphere);

    const sprite = this.createLabel('1/1');
    sprite.position.set(0, 0.4, 0);
    this.scene.add(sprite);
    sphere.userData.labelSprite = sprite;
  }

  resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}

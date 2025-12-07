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
    this.connections = [];

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

    for (let line of this.connections) {
      this.scene.remove(line);
    }
    this.connections = [];
  }

  addPoint(x, y, z, label = "", color = 0x3366ff) {
    const SPACING = 2;
    const geom = new THREE.SphereGeometry(0.2, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ color });
    const sphere = new THREE.Mesh(geom, mat);
    sphere.position.set(x * SPACING, y * SPACING, z * SPACING);
    sphere.userData.lattice = [x, y, z];

    this.scene.add(sphere);
    this.points.push(sphere);

    if (label) {
      const sprite = this.createLabel(label);
      sprite.position.set(x * SPACING, y * SPACING + 0.4, z * SPACING);
      this.scene.add(sprite);
      sphere.userData.labelSprite = sprite;
    }

    for (const other of this.points) {
      if (other !== sphere) {
        this.connectIfVisible({
          mesh: sphere,
          lattice: sphere.userData.lattice
        }, {
          mesh: other,
          lattice: other.userData.lattice
        });
      }
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
    sphere.userData.lattice = [0, 0, 0];

    this.scene.add(sphere);
    this.points.push(sphere);

    const sprite = this.createLabel('1/1');
    sprite.position.set(0, 0.4, 0);
    this.scene.add(sprite);
    sphere.userData.labelSprite = sprite;
  }

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
    const mat = new THREE.LineBasicMaterial({ color: 0x999999 });
    const line = new THREE.Line(geom, mat);

    this.scene.add(line);
    this.connections.push(line);
  }

  resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}

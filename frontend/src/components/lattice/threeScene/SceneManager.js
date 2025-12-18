import * as THREE from "three";
import { fadeInLines, fadeInPoints, fadeOutRemoving } from "./FadeSystem";
import { InteractionSystem } from "./InteractionSystem";
import { CameraSystem } from "./CameraSystems";
import { createCenterPoint } from "./CenterPointSystem";
import { createPoint } from "./PointFactory";
import { TooltipSystem } from "./TooltipSystem";
import { ConnectionSystem } from "./ConnectionSystem";

export class SceneManager {
  // constructor method builds scene on initialization
  constructor(container) {
    this.container = container;
      
    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf9fafb);

    // camera and orbit controls
    this.cameraSystem = new CameraSystem(this.renderer.domElement);
    this.camera = this.cameraSystem.camera;
    this.controls = this.cameraSystem.controls;

    // lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    this.scene.add(light);

    // data structures
    this.points = [];
    this.toRemove = [];

    // hover and click interactions
    this.interactions = new InteractionSystem(this);
    this.tooltip = new TooltipSystem();

    // lattice connections
    this.connections = new ConnectionSystem(this.scene);

    // initialize lattice
    createCenterPoint(this.scene, this.points);

    // bind animation loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // animation loop
  animate() {
    this.cameraSystem.update();

    fadeInPoints(this.points);
    fadeInLines(this.connections.lines);
    fadeOutRemoving(this.toRemove, this.scene);
    
    this.connections.update();

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

  // rebuild lines after points change
  rebuildConnections() {
    this.connections.rebuild(this.points);
  }

  // reset scene, keep lights, camera, and center point
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
    this.connections.clear();
    this.toRemove = [];
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
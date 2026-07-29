import * as THREE from "three";
import type { LatticePointData, LatticePointMesh } from "./types";
import { createCenterPoint } from "./centerPointSystem";
import { createPoint } from "./pointFactory";
import { fadeInLines, fadeInPoints, fadeOutRemoving } from "./fadeSystem";
import { CameraSystem } from "./CameraSystem";
import { TooltipSystem } from "./TooltipSystem";
import { ConnectionSystem } from "./ConnectionSystem";
import { InteractionSystem } from "./InteractionSystem";

export class SceneManager {
  readonly container: HTMLElement;
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly cameraSystem: CameraSystem;
  readonly camera: THREE.PerspectiveCamera;
  readonly controls: CameraSystem["controls"];
  readonly tooltip: TooltipSystem;
  readonly connections: ConnectionSystem;
  readonly interactions: InteractionSystem;

  points: LatticePointMesh[] = [];
  toRemove: LatticePointMesh[] = [];
  onRemove?: (id: string) => void;

  private animationFrameId: number | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf9fafb);

    this.cameraSystem = new CameraSystem(this.renderer.domElement);
    this.camera = this.cameraSystem.camera;
    this.controls = this.cameraSystem.controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);

    this.scene.add(ambientLight, directionalLight);

    this.tooltip = new TooltipSystem();

    this.connections = new ConnectionSystem(this.scene);

    createCenterPoint(this.scene, this.points);

    this.interactions = new InteractionSystem(this);

    this.animate();
  }

  addPoint(
    x: number,
    y: number,
    z: number,
    label: string,
    color: THREE.ColorRepresentation,
    data: Partial<LatticePointData>,
  ): void {
    const mesh = createPoint({
      x,
      y,
      z,
      label,
      color,
      data,
    });

    this.scene.add(mesh);
    this.points.push(mesh);

    const labelSprite = mesh.userData.labelSprite;

    if (labelSprite) this.scene.add(labelSprite);
  }

  rebuildConnections(): void {
    this.connections.rebuild(this.points);
  }

  clearPoints(): void {
    const center = this.points[0];

    for (const point of this.points.slice(1)) this.disposePoint(point);

    this.connections.clear();
    this.toRemove = [];

    this.points = center ? [center] : [];
  }

  resize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    if (width === 0 || height === 0) return;

    this.renderer.setSize(width, height);

    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();
  }

  dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.interactions.cleanup();
    this.cameraSystem.dispose();
    this.connections.clear();

    for (const point of this.points) this.disposePoint(point);

    this.points = [];
    this.toRemove = [];

    this.renderer.dispose();

    const canvas = this.renderer.domElement;

    if (canvas.parentElement === this.container) {
      this.container.removeChild(canvas);
    }
  }

  private animate = (): void => {
    this.cameraSystem.update();

    fadeInPoints(this.points);
    fadeInLines(this.connections.lines);
    fadeOutRemoving(this.toRemove, this.scene);

    this.connections.update();
    this.renderer.render(this.scene, this.camera);

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private disposePoint(point: LatticePointMesh): void {
    this.scene.remove(point);
    point.geometry.dispose();
    point.material.dispose();

    const labelSprite = point.userData.labelSprite;

    if (labelSprite) {
      this.scene.remove(labelSprite);
      labelSprite.material.map?.dispose();
      labelSprite.material.dispose();
    }
  }
}

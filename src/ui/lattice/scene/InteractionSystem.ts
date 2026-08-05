import * as THREE from "three";
import type { LatticePointMesh, SceneManagerInteractionTarget } from "./types";

export class InteractionSystem {
  private readonly sceneManager: SceneManagerInteractionTarget;

  private readonly raycaster = new THREE.Raycaster();

  private readonly mouse = new THREE.Vector2();

  private removalTimeoutId: number | null = null;

  constructor(sceneManager: SceneManagerInteractionTarget) {
    this.sceneManager = sceneManager;

    const canvas = this.sceneManager.renderer.domElement;

    canvas.addEventListener("mousemove", this.handleMouseMove);

    canvas.addEventListener("click", this.handleClick);

    canvas.addEventListener("mouseleave", this.handleMouseLeave);
  }

  cleanup(): void {
    const canvas = this.sceneManager.renderer.domElement;

    canvas.removeEventListener("mousemove", this.handleMouseMove);

    canvas.removeEventListener("click", this.handleClick);

    canvas.removeEventListener("mouseleave", this.handleMouseLeave);

    if (this.removalTimeoutId !== null) {
      window.clearTimeout(this.removalTimeoutId);
    }

    this.sceneManager.tooltip.hide();
  }

  private updateMouse = (event: MouseEvent): void => {
    const canvas = this.sceneManager.renderer.domElement;

    const rectangle = canvas.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rectangle.left) / rectangle.width) * 2 - 1;

    this.mouse.y =
      -((event.clientY - rectangle.top) / rectangle.height) * 2 + 1;
  };

  private getIntersectedPoint(event: MouseEvent): LatticePointMesh | null {
    this.updateMouse(event);

    this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);

    const selectablePoints = this.sceneManager.points.slice(1);

    const intersections = this.raycaster.intersectObjects(
      selectablePoints,
      false,
    );

    const firstIntersection = intersections[0];

    if (!firstIntersection) return null;

    return firstIntersection.object as LatticePointMesh;
  }

  private handleClick = (event: MouseEvent): void => {
    const point = this.getIntersectedPoint(event);

    if (!point || !point.userData?.id) return;

    if (this.sceneManager.toRemove.includes(point)) return;

    this.sceneManager.toRemove.push(point);

    const pointId = point.userData.id;

    this.removalTimeoutId = window.setTimeout(() => {
      this.sceneManager.onRemove?.(pointId);

      this.removalTimeoutId = null;
    }, 300);
  };

  private handleMouseMove = (event: MouseEvent): void => {
    const point = this.getIntersectedPoint(event);

    if (point) {
      this.sceneManager.tooltip.show(
        point.userData,
        event.clientX,
        event.clientY,
      );

      return;
    }

    this.sceneManager.tooltip.hide();
  };

  private handleMouseLeave = (): void => {
    this.sceneManager.tooltip.hide();
  };
}

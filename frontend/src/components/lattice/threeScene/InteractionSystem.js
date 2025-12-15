import * as THREE from 'three';

export class InteractionSystem {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    const dom = this.sm.renderer.domElement;
    dom.addEventListener('mousemove', this.onMouseMove);
    dom.addEventListener('click', this.onClick);
  }

  cleanup() {
    const dom = this.sm.renderer.domElement;
    dom.removeEventListener('mousemove', this.onMouseMove);
    dom.removeEventListener('click', this.onClick);
  }

  updateMouse(event) {
    const rect = this.sm.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  onClick = event => {
    this.updateMouse(event);
    const { sm } = this;

    this.raycaster.setFromCamera(this.mouse, sm.camera);

    const hits = this.raycaster.intersectObjects(
      sm.points.filter(p => p !== sm.points[0])
    );
    if (hits.length === 0) return;

    const obj = hits[0].object;
    if (!obj.userData?.id) return;

    sm.toRemove.push(obj);
    if (sm.onRemove) setTimeout(() => sm.onRemove(obj.userData.id), 300);
  };

  onMouseMove = event => {
    this.updateMouse(event);
    const { sm } = this;

    this.raycaster.setFromCamera(this.mouse, sm.camera);
    const hits = this.raycaster.intersectObjects(
      sm.points.filter(p => p !== sm.points[0])
    );

    if (hits.length > 0) {
      const hit = hits[0].object;
      sm.tooltip.show(hit.userData, event.clientX, event.clientY);
    } else {
      sm.tooltip.hide();
    }
  };
}
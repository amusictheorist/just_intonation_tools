import * as THREE from "three";

/**
 * Creates a canvas-backed Three.js sprite for a lattice point label.
 *
 * @param text The label text to draw on the sprite texture.
 * @returns The label sprite containing the rendered text.
 * @throws If a 2D canvas rendering context cannot be created.
 */

export function createLatticePointLabelSprite(text: string): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create label canvas context");
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "black";
  context.font = "64px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(2, 0.5, 1);

  return sprite;
}

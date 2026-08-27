// @vitest-environment jsdom

import * as THREE from "three";
import { describe, expect, it, vi } from "vitest";
import { findLatticePointAtPointer } from "./findLatticePointAtPointer";

describe("findLatticePointAtPointer", () => {
  it("returns the id of the lattice point under the pointer", () => {
    const canvas = document.createElement("canvas");

    vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      top: 0,
      right: 100,
      bottom: 100,
      left: 0,
      toJSON: () => ({}),
    });

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.2),
      new THREE.MeshBasicMaterial(),
    );

    mesh.userData.latticeScenePointId = "ratio-1";
    mesh.updateMatrixWorld();

    const event = {
      clientX: 50,
      clientY: 50,
    } as PointerEvent;

    const result = findLatticePointAtPointer(event, canvas, camera, [mesh]);

    expect(result).toBe("ratio-1");
  });

  it("returns null when no lattice point is under the pointer", () => {
    const canvas = document.createElement("canvas");

    vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      top: 0,
      right: 100,
      bottom: 100,
      left: 0,
      toJSON: () => ({}),
    });

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.2),
      new THREE.MeshBasicMaterial(),
    );

    mesh.position.set(2, 0, 0);
    mesh.userData.latticeScenePointId = "ratio-1";
    mesh.updateMatrixWorld();

    const event = {
      clientX: 50,
      clientY: 50,
    } as PointerEvent;

    const result = findLatticePointAtPointer(event, canvas, camera, [mesh]);

    expect(result).toBeNull();
  });

  it("interprets pointer coordinates relative to the canvas bounds", () => {
    const canvas = document.createElement("canvas");

    vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
      x: 200,
      y: 100,
      width: 100,
      height: 100,
      top: 100,
      right: 300,
      bottom: 200,
      left: 200,
      toJSON: () => ({}),
    });

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.2),
      new THREE.MeshBasicMaterial(),
    );

    mesh.userData.latticeScenePointId = "ratio-1";
    mesh.updateMatrixWorld();

    const event = {
      clientX: 250,
      clientY: 150,
    } as PointerEvent;

    const result = findLatticePointAtPointer(event, canvas, camera, [mesh]);

    expect(result).toBe("ratio-1");
  });
});

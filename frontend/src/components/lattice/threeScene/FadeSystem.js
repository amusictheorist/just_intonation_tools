export const fadeInPoints = points => {
  for (const p of points) {
    if (!p.material) continue;
    p.material.opacity = Math.min(1, p.material.opacity + 0.05);

    if (p.userData.labelSprite) {
      p.userData.labelSprite.material.opacity = Math.min(1, p.userData.labelSprite.material.opacity + 0.05);
    }
  }
};

export const fadeInLines = lines => {
  for (const line of lines) {
    if (!line.material) continue;
    line.material.opacity = Math.min(1, line.material.opacity + 0.05);
  }
};

export const fadeOutRemoving = (toRemove, scene) => {
  for (let i = toRemove.length - 1; i >= 0; i--) {
    const obj = toRemove[i];

    if (obj.material) {
      obj.material.opacity -= 0.05;
    }

    if (obj.userData?.labelSprite) {
      obj.userData.labelSprite.material.opacity -= 0.05;
    }

    if (obj.material && obj.material.opacity <= 0) {
      scene.remove(obj);
      if (obj.userData?.labelSprite) {
        scene.remove(obj.userData.labelSprite);
      }
      toRemove.splice(i, 1);
    }
  }
};
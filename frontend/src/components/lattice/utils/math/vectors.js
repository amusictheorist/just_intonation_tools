export const vec = (x, y, z) => {
  return { x, y, z };
};
export const addScaled = (a, b, s) => vec(a.x + b.x * s, a.y + b.y * s, a.z + b.z * s);
export const sub = (a, b) => vec(a.x - b.x, a.y - b.y, a.z - b.z);
export const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
export const cross = (a, b) =>
  vec(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  );

export const length = v => Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
export const scale = (v, s) => vec(v.x * s, v.y * s, v.z * s);

export const normalize = v => {
  const len = length(v);
  return len === 0 ? vec(0, 0, 0) : vec(v.x / len, v.y / len, v.z / len);
};

const toRad = deg => (deg * Math.PI) / 180;

const rotateX = (v, angleDeg) => {
  const a = toRad(angleDeg);
  const c = Math.cos(a);
  const s = Math.sin(a);
  const y = v.y * c - v.z * s;
  const z = v.y * s + v.z * c;
  return vec(v.x, y, z);
};

const rotateY = (v, angleDeg) => {
  const a = toRad(angleDeg);
  const c = Math.cos(a);
  const s = Math.sin(a);
  const x = v.x * c + v.z * s;
  const z = -v.x * s + v.z * c;
  return vec(x, v.y, z);
};

const rotateZ = (v, angleDeg) => {
  const a = toRad(angleDeg);
  const c = Math.cos(a);
  const s = Math.sin(a);
  const x = v.x * c - v.y * s;
  const y = v.x * s + v.y * c;
  return vec(x, y, v.z);
};

export const applyRotation = (v, rotation = {}) => {
  const { rotX = 0, rotY = 0, rotZ = 0 } = rotation;
  let out = { ...v };
  out = rotateY(out, rotY);
  out = rotateX(out, rotX);
  out = rotateZ(out, rotZ);
  return out;
};
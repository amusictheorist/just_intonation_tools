import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { Rotation } from "../../../lib/lattice/types";

export type NumberSetter = Dispatch<SetStateAction<number>>;

export type RotationSlidersProps = {
  hasHighPrime: boolean;
  radiusScale: number;
  setRadiusScale: NumberSetter;
  rotX: number;
  setRotX: NumberSetter;
  rotY: number;
  setRotY: NumberSetter;
  rotZ: number;
  setRotZ: NumberSetter;
  masterRot: number;
  setMasterRot: NumberSetter;
  rotXY: number;
  setRotXY: NumberSetter;
  rotYZ: number;
  setRotYZ: NumberSetter;
  rotXZ: number;
  setRotXZ: NumberSetter;
};

type RotationControls = {
  rotX: number;
  rotY: number;
  rotZ: number;
  masterRot: number;
  rotXY: number;
  rotYZ: number;
  rotXZ: number;

  setRotX: NumberSetter;
  setRotY: NumberSetter;
  setRotZ: NumberSetter;
  setMasterRot: NumberSetter;
  setRotXY: NumberSetter;
  setRotYZ: NumberSetter;
  setRotXZ: NumberSetter;

  combinedRot: Rotation;
  resetRotation: () => void;
};

export const useRotationControls = (): RotationControls => {
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [rotZ, setRotZ] = useState(0);

  const [masterRot, setMasterRot] = useState(0);
  const [rotXY, setRotXY] = useState(0);
  const [rotYZ, setRotYZ] = useState(0);
  const [rotXZ, setRotXZ] = useState(0);

  const combinedRot = useMemo<Rotation>(
    () => ({
      rotX: rotX + masterRot + rotXY + rotXZ,
      rotY: rotY + masterRot + rotXY + rotYZ,
      rotZ: rotZ + masterRot + rotYZ + rotXZ,
    }),
    [rotX, rotY, rotZ, masterRot, rotXY, rotYZ, rotXZ],
  );

  const resetRotation = () => {
    setRotX(0);
    setRotY(0);
    setRotZ(0);
    setMasterRot(0);
    setRotXY(0);
    setRotYZ(0);
    setRotXZ(0);
  };

  return {
    rotX,
    rotY,
    rotZ,
    masterRot,
    rotXY,
    rotYZ,
    rotXZ,

    setRotX,
    setRotY,
    setRotZ,
    setMasterRot,
    setRotXY,
    setRotYZ,
    setRotXZ,

    combinedRot,
    resetRotation,
  };
};

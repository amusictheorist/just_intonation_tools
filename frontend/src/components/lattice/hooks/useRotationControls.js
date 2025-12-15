import { useMemo, useState } from "react";

export const useRotationControls = () => {
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [rotZ, setRotZ] = useState(0);
  
  const [masterRot, setMasterRot] = useState(0);
  const [rotXY, setRotXY] = useState(0);
  const [rotYZ, setRotYZ] = useState(0);
  const [rotXZ, setRotXZ] = useState(0);

  const combinedRot = useMemo(() => ({
    rotX: rotX + masterRot + rotXY + rotXZ,
    rotY: rotY + masterRot + rotXY + rotYZ,
    rotZ: rotZ + masterRot + rotYZ + rotXZ
  }), [rotX, rotY, rotZ, masterRot, rotXY, rotYZ, rotXZ]);

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
    rotX, rotY, rotZ,
    masterRot, rotXY, rotYZ, rotXZ,

    setRotX, setRotY, setRotZ,
    setMasterRot, setRotXY, setRotYZ, setRotXZ,

    combinedRot,
    resetRotation
  };
};
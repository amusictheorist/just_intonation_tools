const RotationSliders = ({
  hasHighPrime,
  radiusScale,
  setRadiusScale,
  rotX,
  setRotX,
  rotY,
  setRotY,
  rotZ,
  setRotZ,
  masterRot,
  setMasterRot,
  rotYX,
  setRotXY,
  rotYZ,
  setRotYZ,
  rotXZ,
  setRotXZ
}) => {
  if (!hasHighPrime) return null;

  return (
    <div className="mt-6 w-full flex flex-col items-center gap-6">
      <div className="grid grid-cols-4 gap-x-8 gap-y-4 max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-sm">
          {/* radius control */}
          <label className="font-medium mb-1">Radius</label>
          <input
            type="range"
            min='0.5'
            max='3'
            step='0.01'
            value={radiusScale}
            onChange={e => setRadiusScale(parseFloat(e.target.value))}
            className="w-28"
          />
        </div>

        {/* rotate X */}
        <div className="flex flex-col items-center text-sm">
          <label className="font-medium mb-1">Rotate X</label>
          <input
            type="range"
            min='-180'
            max='180'
            step='1'
            value={rotX}
            onChange={e => setRotX(parseFloat(e.target.value))}
            className="w-28"
          />
        </div>

        {/* rotate Y */}
        <div className="flex flex-col items-center text-sm">
          <label className="font-medium mb-1">Rotate Y</label>
          <input
            type="range"
            min='-180'
            max='180'
            step='1'
            value={rotY}
            onChange={e => setRotY(parseFloat(e.target.value))}
            className="w-28"
          />
        </div>

        {/* rotate Z */}
        <div className="flex flex-col items-center text-sm">
          <label className="font-medium mb-1">Rotate Z</label>
          <input
            type="range"
            min='-180'
            max='180'
            step='1'
            value={rotZ}
            onChange={e => setRotZ(parseFloat(e.target.value))}
            className="w-28"
          />
        </div>

        {/* master rotator */}
        <div className="flex flex-col items-center text-sm">
          <label className="font-medium mb-1">Master Rotator</label>
          <input
            type="range"
            min='-180'
            max='180'
            step='1'
            value={masterRot}
            onChange={e => setMasterRot(parseFloat(e.target.value))}
            className="w-28"
          />
        </div>

        {/* rotate XY */}
        <div className="flex flex-col items-center text-sm">
          <label className="font-medium mb-1">Rotate XY</label>
          <input
            type="range"
            min='-180'
            max='180'
            step='1'
            value={rotXY}
            onChange={e => setRotXY(parseFloat(e.target.value))}
            className="w-28"
          />
        </div>

        {/* rotate YZ */}
        <div className="flex flex-col items-center text-sm">
          <label className="font-medium mb-1">Rotate YZ</label>
          <input
            type="range"
            min='-180'
            max='180'
            step='1'
            value={rotYZ}
            onChange={e => setRotYZ(parseFloat(e.target.value))}
            className="w-28"
          />
        </div>

        {/* rotate XZ */}
        <div className="flex flex-col items-center text-sm">
          <label className="font-medium mb-1">Rotate XZ</label>
          <input
            type="range"
            min='-180'
            max='180'
            step='1'
            value={rotXZ}
            onChange={e => setRotXZ(parseFloat(e.target.value))}
            className="w-28"
          />
        </div>

      </div>
    </div>
  );
};

export default RotationSliders;
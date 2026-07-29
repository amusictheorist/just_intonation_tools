import type {
  NumberSetter,
  RotationSlidersProps,
} from "../hooks/useRotationControls";

type SliderProps = {
  id: string;
  label: string;
  value: number;
  setValue: NumberSetter;
  min: number;
  max: number;
  step: number;
};

function Slider({ id, label, value, setValue, min, max, step }: SliderProps) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="font-medium text-gray-800">
          {label}
        </label>

        <output
          htmlFor={id}
          className="min-w-12 text-right font-mono text-xs text-gray-600"
        >
          {value.toFixed(step < 1 ? 2 : 0)}
        </output>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="w-full"
      />
    </div>
  );
}

function RotationSliders({
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
  rotXY,
  setRotXY,
  rotYZ,
  setRotYZ,
  rotXZ,
  setRotXZ,
}: RotationSlidersProps) {
  if (!hasHighPrime) return null;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <Slider
        id="lattice-radius"
        label="Radius"
        value={radiusScale}
        setValue={setRadiusScale}
        min={0.5}
        max={3}
        step={0.01}
      />

      <Slider
        id="rotation-x"
        label="Rotate X"
        value={rotX}
        setValue={setRotX}
        min={-180}
        max={180}
        step={1}
      />

      <Slider
        id="rotation-y"
        label="Rotate Y"
        value={rotY}
        setValue={setRotY}
        min={-180}
        max={180}
        step={1}
      />

      <Slider
        id="rotation-z"
        label="Rotate Z"
        value={rotZ}
        setValue={setRotZ}
        min={-180}
        max={180}
        step={1}
      />

      <Slider
        id="master-rotation"
        label="Master rotation"
        value={masterRot}
        setValue={setMasterRot}
        min={-180}
        max={180}
        step={1}
      />

      <Slider
        id="rotation-xy"
        label="Rotate XY"
        value={rotXY}
        setValue={setRotXY}
        min={-180}
        max={180}
        step={1}
      />

      <Slider
        id="rotation-yz"
        label="Rotate YZ"
        value={rotYZ}
        setValue={setRotYZ}
        min={-180}
        max={180}
        step={1}
      />

      <Slider
        id="rotation-xz"
        label="Rotate XZ"
        value={rotXZ}
        setValue={setRotXZ}
        min={-180}
        max={180}
        step={1}
      />
    </div>
  );
}

export default RotationSliders;

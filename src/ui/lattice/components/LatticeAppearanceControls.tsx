type LatticeAppearanceControlsProps = {
  higherPrimeColor: string;
  onHigherPrimeColorChange: (color: string) => void;
};

function LatticeAppearanceControls({
  higherPrimeColor,
  onHigherPrimeColorChange,
}: LatticeAppearanceControlsProps) {
  return (
    <label>
      Higher-prime color
      <input
        type="color"
        value={higherPrimeColor}
        onChange={(event) => onHigherPrimeColorChange(event.target.value)}
      />
    </label>
  );
}

export default LatticeAppearanceControls;

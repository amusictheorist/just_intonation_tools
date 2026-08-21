type LatticeAppearanceControlsProps = {
  higherPrimeColor: string;
  onHigherPrimeColorChange: (color: string) => void;
  showConnections: boolean;
  onShowConnectionsChange: (show: boolean) => void;
  availableConnectionPrimes: readonly bigint[];
  visibleConnectionPrimes: ReadonlySet<bigint> | null;
  onConnectionPrimeVisibilityChange: (prime: bigint, visible: boolean) => void;
};

function LatticeAppearanceControls({
  higherPrimeColor,
  onHigherPrimeColorChange,
  showConnections,
  onShowConnectionsChange,
  availableConnectionPrimes,
  visibleConnectionPrimes,
  onConnectionPrimeVisibilityChange,
}: LatticeAppearanceControlsProps) {
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={showConnections}
          onChange={(event) => onShowConnectionsChange(event.target.checked)}
        />
        Show connections
      </label>

      {showConnections &&
        availableConnectionPrimes.map((prime) => (
          <label key={prime.toString()}>
            <input
              type="checkbox"
              checked={
                visibleConnectionPrimes === null ||
                visibleConnectionPrimes.has(prime)
              }
              onChange={(event) =>
                onConnectionPrimeVisibilityChange(prime, event.target.checked)
              }
            />
            {prime.toString()}
          </label>
        ))}

      <label>
        Higher-prime color
        <input
          type="color"
          value={higherPrimeColor}
          onChange={(event) => onHigherPrimeColorChange(event.target.value)}
        />
      </label>
    </div>
  );
}

export default LatticeAppearanceControls;

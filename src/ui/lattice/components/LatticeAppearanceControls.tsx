type LatticeAppearanceControlsProps = {
  showConnections: boolean;
  onShowConnectionsChange: (show: boolean) => void;
  availableConnectionPrimes: readonly bigint[];
  visibleConnectionPrimes: ReadonlySet<bigint> | null;
  onConnectionPrimeVisibilityChange: (prime: bigint, visible: boolean) => void;
};

function LatticeAppearanceControls({
  showConnections,
  onShowConnectionsChange,
  availableConnectionPrimes,
  visibleConnectionPrimes,
  onConnectionPrimeVisibilityChange,
}: LatticeAppearanceControlsProps) {
  return (
    <fieldset className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
      <legend className="px-1 font-medium text-gray-700">Connections</legend>

      <div className="flex max-w-64 flex-wrap items-center gap-x-2 gap-y-1">
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={showConnections}
            onChange={(event) => onShowConnectionsChange(event.target.checked)}
          />
          Show
        </label>

        {showConnections &&
          availableConnectionPrimes.map((prime) => (
            <label key={prime.toString()} className="flex items-center gap-1">
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
      </div>
    </fieldset>
  );
}

export default LatticeAppearanceControls;

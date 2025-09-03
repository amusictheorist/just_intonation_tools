import { getParcSC, getParcset, getParSC, getParset, sumArray } from "../../utils/spiralSets";

const InfoPanel = ({ selected, onClear }) => {
  const selectedArr = [...selected].sort((a, b) => a - b);

  if (selectedArr.length === 0) {
    return (
      <div className="p-4 bg-white border border-gray-300 rounded-lg shadow w-full text-sm text-left space-y-2">
        <h3 className="text-lg font-semibold mb-2">Selected partials</h3>
        <p className="text-gray-500 text-sm italic">None selected</p>
      </div>
    );
  }

  const parset = getParset(selectedArr);
  const parcset = getParcset(selectedArr);
  const parSC = getParSC(selectedArr);
  const parcSC = getParcSC(selectedArr);

  const spectralExtP = sumArray(parSC);
  const spectralExtPC = sumArray(parcSC);

  const formatSet = (arr, braces = '{}', underline = false) => {
    const [open, close] = braces.split('');
    return (
      <span>
        {open}
        {arr.map((x, i) => (
          <span key={i} className={underline ? 'underline' : ''}>
            {x}
            {i < arr.length - 1 ? ', ' : ''}
          </span>
        ))}
        {close}
      </span>
    );
  };

  return (
    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow w-full text-sm text-left space-y-2">
      <h3 className="text-lg font-semibold mb-2">Selected partials</h3>
        <button
          onClick={onClear}
          className="text-xs text-red-500 hover:underline"
        >
          Clear
        </button>
      <p>
        <strong>Partial set:</strong> {formatSet(parset, '{}')}
      </p>
      <p>
        <strong>Partial-class set:</strong>{' '}
        {formatSet(parcset, '{}', true)}
      </p>
      <p>
        <strong>Partial-set class:</strong> {formatSet(parSC, '[]')}
      </p>
      <p>
        <strong>Partial-class set class:</strong>{' '}
        {formatSet(parcSC, '[]', true)}
      </p>
       <p>
        <strong>
          Spectral Extension<sub>p</sub>:
        </strong> {spectralExtP}
      </p>
      <p>
        <strong>
          Spectral Extension<sub>pc</sub>:
        </strong> {spectralExtPC}
      </p>
    </div>
  );
};

export default InfoPanel;

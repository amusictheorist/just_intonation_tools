import { useState } from "react";
import { getParcSC, getParcset, getParSC, getParset, getPCIntMatrix, getPitchIntMatrix, getSubsets, sumArray } from "../../utils/spiralSets";

const InfoPanel = ({ selected, onClear }) => {
  const [showMatrices, setShowMatrices] = useState(false);
  const [showSubsets, setShowSubsets] = useState(false);

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

  const pMatrix = getPitchIntMatrix(selectedArr);
  const pcMatrix = getPCIntMatrix(selectedArr);

  const subsets = getSubsets(selectedArr);

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

  const renderMatrix = (elements, matrix) => (
    <table className="border-collapse border border-gray-400 text-sm mx-auto">
      <thead>
        <tr>
          <th className="border border-gray-400 p-1"></th>
          {elements.map((e, idx) => (
            <th key={idx} className="border border-gray-400 p-1">{e}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {matrix.map((row, i) => (
          <tr key={i}>
            <th className="border border-gray-400 p-1">{elements[i]}</th>
            {row.map((cell, j) => (
              <td key={j} className="border border-gray-400 p-1 text-center">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow w-full text-sm text-left space-y-2">
      <h3 className="text-lg font-semibold mb-2">Selected partials</h3>
      <button
        onClick={onClear}
        className="text-xs text-red-500 hover:underline"
      >
        Clear
      </button>
      <p><strong>Partial set:</strong> {formatSet(parset, '{}')}</p>
      <p><strong>Partial-class set:</strong> {formatSet(parcset, '{}', true)}</p>
      <p><strong>Partial-set class:</strong> {formatSet(parSC, '[]')}</p>
      <p><strong>Partial-class set class:</strong> {formatSet(parcSC, '[]', true)}</p>
      <p><strong>Spectral Extension<sub>p</sub>:</strong> {spectralExtP}</p>
      <p><strong>Spectral Extension<sub>pc</sub>:</strong> {spectralExtPC}</p>

      <hr className="my-2" />

      {parset.length > 1 && (
        <div className="mb-2">
          <button
            onClick={() => setShowMatrices(!showMatrices)}
            className="text-xs text-blue-600 hover:underline mb-1"
          >
            {showMatrices ? 'Hide' : 'Show'} interval matrices
          </button>
          {showMatrices && (
            <div>
              <div>
                <strong>Pitch intervals:</strong>
                {renderMatrix(pMatrix.elements, pMatrix.matrix)}
              </div>
              {parcset.length > 1 && (
                <div className="mt-2">
                  <strong>Pitch-class intervals:</strong>
                  {renderMatrix(pcMatrix.elements, pcMatrix.matrix)}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <hr className="my-2" />

      {parset.length > 3 && (
        <div>
          <button
            onClick={() => setShowSubsets(!showSubsets)}
            className="text-xs text-blue-600 hover:underline mb-1"
          >
            {showSubsets ? 'Hide' : 'Show'} subsets
          </button>
          {showSubsets && Object.keys(subsets).sort((a, b) => a - b).map(size => {
            const scMap = {};
            subsets[size].forEach(subset => {
              const sc = getParSC(subset);
              const key = sc.join(',');
              scMap[key] = sc;
            });
            const uniqueSCs = Object.values(scMap);
            
            return (
              <div key={size} className="mt-2">
                <p className="font-medium">
                  Size {size}: ({uniqueSCs.length} classes)
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-700">
                  {uniqueSCs.map((sc, idx) => (
                    <div key={idx}>{formatSet(sc, '[]')}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InfoPanel;

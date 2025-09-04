import { useState } from "react";
import { getParcSC, getParcset, getParSC, getParset, getPCIntMatrix, getPitchIntMatrix, getSubsets, sumArray } from "../../utils/spiralSets";
import FormatSet from "./FormatSet";
import MatrixTable from "./MatrixTable";
import SubsetSection from "./SubsetSection";

const InfoPanel = ({ selected, onClear }) => {
  const [showMatrices, setShowMatrices] = useState(false);
  const [showPitchSubsets, setPitchShowSubsets] = useState(false);
  const [showPCSubsets, setShowPCSubsets] = useState(false);

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

  return (
    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow w-full text-sm text-left space-y-2">
      <h3 className="text-lg font-semibold mb-2">Selected partials</h3>
      <button
        onClick={onClear}
        className="text-xs text-red-500 hover:underline"
      >
        Clear
      </button>
      <p><strong>Partial set:</strong> <FormatSet arr={parset} braces="{}" /></p>
      <p><strong>Partial-class set:</strong> <FormatSet arr={parcset} braces="{}" underline='true' /></p>
      <p><strong>Partial-set class:</strong> <FormatSet arr={parSC} braces="[]" /></p>
      <p><strong>Partial-class set class:</strong> <FormatSet arr={parcSC} braces="[]" underline='true' /></p>
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
                <MatrixTable elements={pMatrix.elements} matrix={pMatrix.matrix} />
              </div>
              {parcset.length > 1 && (
                <div className="mt-2">
                  <strong>Pitch-class intervals:</strong>
                  <MatrixTable elements={pcMatrix.elements} matrix={pcMatrix.matrix} />
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
            onClick={() => setPitchShowSubsets(!showPitchSubsets)}
            className="text-xs text-blue-600 hover:underline mb-1"
          >
            {showPitchSubsets ? 'Hide' : 'Show'} pitch subsets
          </button>
          {showPitchSubsets &&
            <SubsetSection
              title='Pitch subsets'
              subsets={subsets}
              getSC={getParSC}
              show={showPitchSubsets}
              underline={false}
            />
          }
        </div>
      )}

      <hr className="my-2" />

      {parcset.length > 3 && (
        <div>
          <button
            onClick={() => setShowPCSubsets(!showPCSubsets)}
            className="text-xs text-blue-600 hover:underline mb-1"
          >
            {showPCSubsets ? 'Hide' : 'Show'} pitch-class subsets
          </button>
          {showPCSubsets &&
            <SubsetSection
              title='Pitch-class subsets'
              subsets={subsets}
              getSC={getParcSC}
              show={showPCSubsets}
              underline={true}
            />
          }
        </div>
      )}
    </div>
  );
};

export default InfoPanel;

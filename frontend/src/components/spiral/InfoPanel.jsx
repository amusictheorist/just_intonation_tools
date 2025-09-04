import { useState } from "react";
import { getParcSC, getParcset, getParSC, getParset, getPCIntMatrix, getPitchIntMatrix, getSubsets, sumArray } from "../../utils/spiralSets";
import MatrixTable from "./MatrixTable";
import SubsetSection from "./SubsetSection";
import SummarySection from "./SummarySection";
import CollapsibleSection from "./CollapsibleSection";

const InfoPanel = ({ selected, onClear }) => {
  const [showMatrices, setShowMatrices] = useState(false);
  const [showPitchSubsets, setShowPitchSubsets] = useState(false);
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
      <SummarySection
        parset={parset}
        parcset={parcset}
        parSC={parSC}
        parcSC={parcSC}
        spectralExtP={spectralExtP}
        spectralExtPC={spectralExtPC}
      />

      <hr className="my-2" />

      {parset.length > 1 && (
        <CollapsibleSection title="interval matrices" show={showMatrices} onToggle={() => setShowMatrices(!showMatrices)}>
          <div>
            <strong>Pitch intervals:</strong>
            <MatrixTable elements={pMatrix.elements} matrix={pMatrix.matrix} />
            {parcset.length > 1 && (
              <>
                <strong>Pitch-class intervals:</strong>
                <MatrixTable elements={pcMatrix.elements} matrix={pcMatrix.matrix} />
              </>
            )}
          </div>
        </CollapsibleSection>
      )}

      <hr className="my-2" />

      {parset.length > 3 && (
        <CollapsibleSection
          title='pitch subsets'
          show={showPitchSubsets}
          onToggle={() => setShowPitchSubsets(!showPitchSubsets)}
        >
          <SubsetSection
            subsets={subsets}
            getSC={getParSC}
            underline={false}
          />
        </CollapsibleSection>
      )}

      <hr className="my-2" />

      {parcset.length > 3 && (
        <CollapsibleSection
          title='pitch-class subsets'
          show={showPCSubsets}
          onToggle={() => setShowPCSubsets(!showPCSubsets)}
        >
          <SubsetSection
            subsets={subsets}
            getSC={getParcSC}
            underline={true}
          />
        </CollapsibleSection>
      )}
    </div>
  );
};

export default InfoPanel;

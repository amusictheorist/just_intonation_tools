import { useMemo, useState } from "react";
import {
  getParcSC,
  getParcset,
  getParSC,
  getParset,
  getPCIntMatrix,
  getPitchIntMatrix,
  getSubsets,
  sumArray,
} from "../../../lib/spiral/sets";
import CollapsibleSection from "./CollapsibleSection";
import MatrixTable from "./MatrixTable";
import SubsetSection from "./SubsetSection";
import SummarySection from "./SummarySection";

type InfoPanelProps = {
  selected: Set<number>;
  onClear: () => void;
};

function InfoPanel({ selected, onClear }: InfoPanelProps) {
  const [showMatrices, setShowMatrices] = useState(false);

  const [showPitchSubsets, setShowPitchSubsets] = useState(false);

  const [showPartialClassSubsets, setShowPartialClassSubsets] = useState(false);

  const selectedValues = useMemo(
    () => Array.from(selected).sort((first, second) => first - second),
    [selected],
  );

  const analysis = useMemo(() => {
    if (selectedValues.length === 0) {
      return null;
    }

    const parset = getParset(selectedValues);

    const parcset = getParcset(selectedValues);

    const parSC = getParSC(selectedValues);

    const parcSC = getParcSC(selectedValues);

    return {
      parset,
      parcset,
      parSC,
      parcSC,
      spectralExtP: sumArray(parSC),
      spectralExtPC: sumArray(parcSC),
      pitchMatrix: getPitchIntMatrix(selectedValues),
      partialClassMatrix: getPCIntMatrix(selectedValues),
      subsets: getSubsets(selectedValues),
    };
  }, [selectedValues]);

  if (!analysis) {
    return (
      <section className="w-full rounded-lg border border-gray-300 bg-white p-4 text-left text-sm shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Selected partials
        </h2>

        <p className="mt-2 italic text-gray-500">None selected</p>
      </section>
    );
  }

  const {
    parset,
    parcset,
    parSC,
    parcSC,
    spectralExtP,
    spectralExtPC,
    pitchMatrix,
    partialClassMatrix,
    subsets,
  } = analysis;

  return (
    <section className="w-full space-y-4 rounded-lg border border-gray-300 bg-white p-4 text-left text-sm shadow-sm">
      <header className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Selected partials
        </h2>

        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-red-600 hover:underline"
        >
          Clear selection
        </button>
      </header>

      <SummarySection
        parset={parset}
        parcset={parcset}
        parSC={parSC}
        parcSC={parcSC}
        spectralExtP={spectralExtP}
        spectralExtPC={spectralExtPC}
      />

      {parset.length > 1 && (
        <div className="border-t border-gray-200 pt-3">
          <CollapsibleSection
            title="interval matrices"
            show={showMatrices}
            onToggle={() => setShowMatrices((current) => !current)}
          >
            <div className="space-y-4">
              <div>
                <p className="mb-2 font-semibold">Pitch intervals</p>

                <MatrixTable
                  elements={pitchMatrix.elements}
                  matrix={pitchMatrix.matrix}
                />
              </div>

              {parcset.length > 1 && (
                <div>
                  <p className="mb-2 font-semibold">Partial-class intervals</p>

                  <MatrixTable
                    elements={partialClassMatrix.elements}
                    matrix={partialClassMatrix.matrix}
                  />
                </div>
              )}
            </div>
          </CollapsibleSection>
        </div>
      )}

      {parset.length > 3 && (
        <div className="border-t border-gray-200 pt-3">
          <CollapsibleSection
            title="pitch subsets"
            show={showPitchSubsets}
            onToggle={() => setShowPitchSubsets((current) => !current)}
          >
            <SubsetSection subsets={subsets} getSC={getParSC} />
          </CollapsibleSection>
        </div>
      )}

      {parcset.length > 3 && (
        <div className="border-t border-gray-200 pt-3">
          <CollapsibleSection
            title="partial-class subsets"
            show={showPartialClassSubsets}
            onToggle={() => setShowPartialClassSubsets((current) => !current)}
          >
            <SubsetSection subsets={subsets} getSC={getParcSC} underline />
          </CollapsibleSection>
        </div>
      )}
    </section>
  );
}

export default InfoPanel;

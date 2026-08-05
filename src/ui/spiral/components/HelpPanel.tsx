import { X } from "lucide-react";
import Collapsible from "../../lattice/components/Collapsible";

type HelpPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

const paragraphClasses = "space-y-3 text-left text-sm leading-6 text-gray-600";

function HelpPanel({ isOpen, onClose }: HelpPanelProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close spiral help"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/20"
        />
      )}

      <aside
        aria-label="Spiral help"
        aria-hidden={!isOpen}
        className={[
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col",
          "border-l border-gray-200 bg-white shadow-xl",
          "transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Spiral help</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close spiral help"
            className="rounded-md p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
          <Collapsible
            title="What you’re looking at"
            animated={false}
            titleClassName="font-semibold text-gray-900"
          >
            <div className={paragraphClasses}>
              <p>
                The visualizer places partials along a logarithmic spiral.
                Distance from the centre corresponds to octave height, while
                angular position repeats at octave equivalence.
              </p>
            </div>
          </Collapsible>

          <Collapsible
            title="Input and selection"
            animated={false}
            titleClassName="font-semibold text-gray-900"
          >
            <div className={paragraphClasses}>
              <p>
                Enter individual partial numbers, comma- or space-separated
                lists, or ranges such as 8–16. Select points to include them in
                the analysis panel.
              </p>
            </div>
          </Collapsible>

          <Collapsible
            title="Navigation"
            animated={false}
            titleClassName="font-semibold text-gray-900"
          >
            <div className={paragraphClasses}>
              <p>
                Drag the spiral to pan. Use the zoom controls to move closer or
                farther away, and use Reset view to return to the initial camera
                position.
              </p>

              <p>
                The arrow keys or W, A, S, and D can also pan the view when a
                form control is not focused.
              </p>
            </div>
          </Collapsible>

          <Collapsible
            title="Sets and analysis"
            animated={false}
            titleClassName="font-semibold text-gray-900"
          >
            <div className={paragraphClasses}>
              <p>
                Selected partials generate partial-set and partial-class
                information in the side panel, including interval matrices and
                subsets when enough elements are selected.
              </p>
            </div>
          </Collapsible>
        </div>
      </aside>
    </>
  );
}

export default HelpPanel;

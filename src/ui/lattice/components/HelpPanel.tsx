import { X } from "lucide-react";
import Collapsible from "./Collapsible";

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
          aria-label="Close lattice help"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/20"
        />
      )}

      <aside
        aria-label="Lattice help"
        aria-hidden={!isOpen}
        className={[
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col",
          "border-l border-gray-200 bg-white shadow-xl",
          "transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Lattice help</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close lattice help"
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
                This visualizer places musical ratios into a three-dimensional
                just-intonation lattice. The central sphere is 1/1, the
                reference pitch. Each ratio you add is factored into primes and
                placed according to the selected layout mode.
              </p>

              <p>
                Cubic modes map ratios into the 1/1–2/1 octave. Radial modes
                arrange primes around 1/1 in a circular layout. Expanded Radial
                also displays ratios below 1/1.
              </p>
            </div>
          </Collapsible>

          <Collapsible
            title="What you can input"
            animated={false}
            titleClassName="font-semibold text-gray-900"
          >
            <div className={paragraphClasses}>
              <p>Accepted inputs include:</p>

              <ul className="ml-5 list-disc space-y-1">
                <li>
                  Whole numbers, such as <code>3</code>, interpreted as{" "}
                  <code>3/1</code>.
                </li>
                <li>
                  Fractions such as <code>5/4</code>, <code>9/8</code>,{" "}
                  <code>7/6</code>, or <code>11/8</code>.
                </li>
                <li>All ratios are octave-reduced.</li>
                <li>Ratios below 1/1 appear only in Expanded Radial mode.</li>
                <li>
                  Higher primes such as 11, 13, and 17 are disallowed only in
                  basic Cubic mode.
                </li>
              </ul>

              <p>
                Inputs are reduced to simplest form, factored, and positioned
                according to the chosen mode.
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
                Enter ratios in the control panel and press Enter or Add. Undo
                reverses the most recent change, and Reset clears the canvas
                except for 1/1.
              </p>

              <p>
                Hover over a point to see information about its ratio, or select
                it to remove it. Drag to rotate the lattice and scroll to zoom.
              </p>
            </div>
          </Collapsible>

          <Collapsible
            title="Prime controls"
            animated={false}
            titleClassName="font-semibold text-gray-900"
          >
            <div className={paragraphClasses}>
              <p>
                In Cubic modes, ratios based on 3, 5, and 7 map to the x-, y-,
                and z-axes. Higher primes are disabled in basic Cubic mode but
                allowed in Expanded Cubic mode, where each higher prime forms
                its own local lattice around 1/1.
              </p>

              <p>
                In Radial modes, prime directions radiate around 1/1 instead of
                using fixed axes. Expanded Radial also supports ratios below
                1/1, mapped along the negative y-axis.
              </p>
            </div>
          </Collapsible>

          <Collapsible
            title="Modes"
            animated={false}
            titleClassName="font-semibold text-gray-900"
          >
            <ul className="ml-5 list-disc space-y-2 text-left text-sm leading-6 text-gray-600">
              <li>
                <strong>Cubic:</strong> a classic 3D JI lattice for 3-, 5-, and
                7-limit harmony.
              </li>
              <li>
                <strong>Expanded Cubic:</strong> adds higher primes in separate
                local lattices.
              </li>
              <li>
                <strong>Radial:</strong> arranges prime directions around 1/1.
              </li>
              <li>
                <strong>Expanded Radial:</strong> adds ratios below 1/1 to the
                radial layout.
              </li>
            </ul>
          </Collapsible>

          <Collapsible
            title="Rotation settings"
            animated={false}
            titleClassName="font-semibold text-gray-900"
          >
            <div className={paragraphClasses}>
              <p>
                Higher-prime lattices can be repositioned using the rotation
                controls. Radius changes their distance from the centre, while
                the rotation sliders adjust their placement along one or more
                axes. The colour control distinguishes higher-prime points from
                the main 3–5–7 lattice.
              </p>
            </div>
          </Collapsible>

          <Collapsible
            title="Tips and examples"
            animated={false}
            titleClassName="font-semibold text-gray-900"
          >
            <div className={paragraphClasses}>
              <p>
                Try building 3-, 5-, and 7-limit shapes, adding higher primes in
                Expanded Cubic mode, or entering sub-octave ratios in Expanded
                Radial mode. Adjust the radius and rotation controls when
                structures become visually dense.
              </p>
            </div>
          </Collapsible>
        </div>
      </aside>
    </>
  );
}

export default HelpPanel;

import { X } from 'lucide-react';
import CollapsibleHelp from './CollapsibleHelp';

const HelpPanel = ({ isOpen, onClose }) => {
  const pClass = 'text-sm text-left text-gray-600 italic';

  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-80 bg-white shadow-xl border-l border-gray-200 
        transition-transform duration-300 z-50 
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      <div className='flex items-center justify-between px-4 py-3 border-b'>
        <h2 className='text-lg font-semibold'>Lattice Help</h2>
        <button onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="overflow-y-auto px-4 py-3 space-y-6" style={{ height: "calc(100% - 56px)" }}>

        <CollapsibleHelp title="What You're Looking At">
          <section>
            <div className={pClass}>
              <p>
                This visualizer places musical ratios into a 3D just-intonation lattice.
                The central sphere is 1/1 (the reference pitch). Each ratio you add is
                factored into primes and placed according to the selected layout mode.
              </p>
              <p>
                Cubic modes map ratios into the 1/1–2/1 octave; Radial modes arrange
                primes around 1/1 in a circular layout. Expanded Radial also displays
                ratios below 1/1.
              </p>
            </div>
          </section>
        </CollapsibleHelp>
        
        <CollapsibleHelp title='What You Can Input'>
          <div className={pClass}>
            <p>Accepted inputs:</p>
            <ul className='list-disc ml-4'>
              <li>Whole numbers (e.g., <code>3</code> → <code>3/1</code>)</li>
              <li>Fractions like <code>5/4</code>, <code>9/8</code>, <code>7/6</code>, <code>11/8</code></li>
              <li>Ratios &gt; 2/1 are octave-reduced unless in Expanded Radial</li>
              <li>Ratios &lt; 1/1 appear only in Expanded Radial</li>
              <li>Higher primes (11, 13, 17…) allowed only in Expanded modes</li>
            </ul>
            <p>
              Inputs are reduced to simplest form, factored, and positioned according to the chosen mode.
            </p>
          </div>
        </CollapsibleHelp>

        <CollapsibleHelp title="Navigation">
          <section>
            <div className={pClass}>
              <p>
                Enter ratios at the top and press Enter or Add. Undo removes the last ratio, and Reset clears the canvas except for 1/1.
              </p>
              <p>
                Hover to see information about a ratio, or click to remove it. Drag to rotate the lattice and scroll to zoom.
              </p>
            </div>
          </section>
        </CollapsibleHelp>

        <CollapsibleHelp title='Prime Controls'>
          <section>
            <div className={pClass}>
              <p>
                In Cubic modes, ratios based on 3, 5, and 7 map to the x-, y-, and z-axes.
                Higher primes are disabled in basic Cubic but allowed in Expanded Cubic,
                where each higher prime forms its own “local lattice” arranged around 1/1
                without interfering with the main axes.
              </p>
              <p>
                In Radial modes, prime directions radiate around 1/1 instead of using fixed
                axes. Expanded Radial also supports ratios below 1/1, mapped along the
                negative Y-axis.
              </p>
            </div>
          </section>
        </CollapsibleHelp>

        <CollapsibleHelp title='Modes (When to Use Each)'>
          <section>
            <ul className="list-disc text-left ml-5 text-sm text-gray-600 italic space-y-1">
              <li><strong>Cubic</strong> – Classic 3D JI lattice for 3-, 5-, 7-limit harmony.</li>
              <li><strong>Expanded Cubic</strong> – Adds higher primes (11+) in separate lattices.</li>
              <li><strong>Radial</strong> – Circular prime arrangement around 1/1.</li>
              <li><strong>Expanded Radial</strong> – Radial layout + ratios below 1/1.</li>
            </ul>
          </section>
        </CollapsibleHelp>

        <CollapsibleHelp title='Rotation Settings'>
          <section>
            <div className={pClass}>
              <p>
                Higher prime lattices can be repositioned using rotation controls. Radius adjusts their distance from the center, and sliders rotate them along each axis. Color settings help distinguish them from the main 3–5–7 lattice.
              </p>
            </div>
          </section>
        </CollapsibleHelp>

        <CollapsibleHelp title='Tips & Examples'>
          <section>
            <div className={pClass}>
            <p>
              Try exploring 3-, 5-, and 7-limit shapes, add higher primes in Expanded Cubic,
              or experiment with sub-octave ratios in Expanded Radial. Adjust radius and
              rotation sliders when structures become visually dense.
            </p>
            </div>
          </section>
        </CollapsibleHelp>

      </div>
    </div>
  );
};

export default HelpPanel;

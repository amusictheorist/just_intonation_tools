import { X } from 'lucide-react';
import Collapsible from '../../lattice/ui/Collapsible';

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
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-lg font-semibold">Spiral Help</h2>
        <button onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div
        className="overflow-y-auto px-4 py-3 space-y-6"
        style={{ height: 'calc(100% - 56px)' }}
      >
        <Collapsible title="What You're Looking At" animated={false}>
          <div className={pClass}>
            <p>
              This visualizer places musical ratios along a logarithmic spiral.
              Distance from the center corresponds to octave height, and angular
              position reflects harmonic relationships.
            </p>
          </div>
        </Collapsible>

        <Collapsible title="Input & Selection" animated={false}>
          <div className={pClass}>
            <p>
              Enter ratios or partial numbers to display them on the spiral.
              Click points to select them and view analytical information.
            </p>
          </div>
        </Collapsible>

        <Collapsible title="Navigation" animated={false}>
          <div className={pClass}>
            <p>
              Drag to pan the spiral, scroll to zoom, and use camera controls
              to reset or reframe the view.
            </p>
          </div>
        </Collapsible>

        <Collapsible title="Sets & Analysis" animated={false}>
          <div className={pClass}>
            <p>
              Selected points generate pitch sets, pitch-class sets,
              interval matrices, and subsets shown in the side panels.
            </p>
          </div>
        </Collapsible>
      </div>
    </div>
  );
};

export default HelpPanel;

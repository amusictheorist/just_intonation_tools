import { HelpCircle } from 'lucide-react';

const HelpButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      title="Open Help"
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2
        p-2 rounded-full
        bg-white shadow border border-gray-200
        hover:bg-gray-100
        text-gray-700
        z-40
      "
    >
      <HelpCircle size={20} />
    </button>
  );
};

export default HelpButton;

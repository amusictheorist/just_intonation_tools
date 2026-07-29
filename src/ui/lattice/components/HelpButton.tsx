import { HelpCircle } from "lucide-react";

type HelpButtonProps = {
  onClick: () => void;
};

function HelpButton({ onClick }: HelpButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open lattice help"
      title="Open lattice help"
      className="fixed bottom-5 right-5 z-40 rounded-full border border-gray-200 bg-white p-3 text-gray-700 shadow-md transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
    >
      <HelpCircle aria-hidden="true" size={22} />
    </button>
  );
}

export default HelpButton;

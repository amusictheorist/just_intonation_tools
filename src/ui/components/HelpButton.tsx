import { HelpCircle } from "lucide-react";

type HelpButtonProps = {
  onClick: () => void;
  label?: string;
};

function HelpButton({ onClick, label = "Open help" }: HelpButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="fixed bottom-5 right-5 z-40 rounded-full border border-gray-200 bg-white p-3 text-gray-700 shadow-md transition hover:bg-gray-100"
    >
      <HelpCircle aria-hidden="true" size={22} />
    </button>
  );
}

export default HelpButton;

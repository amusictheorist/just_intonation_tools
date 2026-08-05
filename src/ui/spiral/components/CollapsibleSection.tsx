import type { ReactNode } from "react";

type CollapsibleSectionProps = {
  title: string;
  show: boolean;
  onToggle: () => void;
  children: ReactNode;
};

function CollapsibleSection({
  title,
  show,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <section className="mb-2">
      <button
        type="button"
        aria-expanded={show}
        onClick={onToggle}
        className="mb-1 text-xs text-blue-700 hover:underline"
      >
        {show ? "Hide" : "Show"} {title}
      </button>

      {show && <div>{children}</div>}
    </section>
  );
}

export default CollapsibleSection;

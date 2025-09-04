const CollapsibleSection = ({ title, show, onToggle, children }) => (
  <div className="mb-2">
    <button onClick={onToggle} className="text-xs text-blue-600 hover:underline mb-1">
      {show ? 'Hide' : 'Show'} {title}
    </button>
    {show && <div>{children}</div>}
  </div>
);

export default CollapsibleSection;
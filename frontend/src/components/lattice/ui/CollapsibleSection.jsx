import { useEffect, useRef, useState } from "react";

const CollapsibleSection = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  const contentRef = useRef(null);
  const [height, setHeight] = useState('auto');

  useEffect(() => {
    if (open) {
      const fullHeight = contentRef.current.scrollHeight;
      setHeight(fullHeight);
      const id = setTimeout(() => setHeight('auto'), 200);
      return () => clearTimeout(id);
    } else {
      const fullHeight = contentRef.current.scrollHeight;
      setHeight(fullHeight);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [open]);

  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      <button
        className="w-full flex justify-between items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
        onClick={() => setOpen(o => !o)}
      >
        <span>{title}</span>
        <span className="text-lg">{open ? "▲" : "▼"}</span>
      </button>

      <div
        style={{
          overflow: 'hidden',
          transition: 'height 0.25s ease',
          height
        }}
      >
        <div ref={contentRef} className="p-4 bg-gray-100 rounded-b">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const Collapsible = ({
  title,
  children,
  defaultOpen = true,
  animated = false,
  className = '',
  titleClass = '',
  contentClass = ''
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [height, setHeight] = useState('auto');
  const ref = useRef(null);

  useEffect(() => {
    if (!animated) return;

    if (open) {
      const fullHeight = ref.current.scrollHeight;
      setHeight(fullHeight);
      const id = setTimeout(() => setHeight('auto'), 200);
      return () => clearTimeout(id);
    } else {
      const fullHeight = ref.current.scrollHeight;
      setHeight(fullHeight);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [open, animated]);

  return (
    <div className={`w-full ${className}`}>
      <button
        className={`w-full flex items-center justify-between py-2 text-left ${titleClass}`}
        onClick={() => setOpen(o => !o)}
      >
        <span>{title}</span>
        {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>

      <div
        style={
          animated
            ? {
              overflow: 'hidden',
              transition: 'height 0.25s ease',
              height
            }
            : {}
        }
      >
        <div
          ref={ref}
          className={`mt-1 pl-1 pr-2 text-gray-700 text-sm ${contentClass}`}
          style={!animated ? { display: open ? 'block' : 'none' } : {}}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Collapsible;
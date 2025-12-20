import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const CollapsibleHelp = ({ title, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className='border-b border-gray-200 pb-2'>
      <button
        className='w-full flex items-center justify-between py-2 text-left'
        onClick={() => setOpen(!open)}
      >
        <span className='font-medium text-gray-800'>{title}</span>
        {open ? <ChevronDown size-={18} /> : <ChevronRight size={18} />}
      </button>

      {open && (
        <div className='mt-1 pl-1 pr-2 text-sm text-gray-600'>{children}</div>
      )}
    </div>
  );
};

export default CollapsibleHelp;
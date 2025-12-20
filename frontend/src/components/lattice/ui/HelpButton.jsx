import { HelpCircle } from 'lucide-react';

const HelpButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className='p-2 rounded hover:bg-gray-200 text-gray-700'
      title='Open Help'
    >
      <HelpCircle size={20} />
    </button>
  );
};

export default HelpButton;
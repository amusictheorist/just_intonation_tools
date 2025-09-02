const InfoPanel = ({ selected }) => (
  <div className="p-4 bg-white border border-gray-300 rounded-lg shadow w-64">
    <h3 className="text-lg font-semibold mb-2">Selected partials</h3>
    {selected.size > 0 ? (
      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
        {[...selected].map((val) => (
          <li key={val}>{val}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 text-sm italic">None selected</p>
    )}
  </div>
);

export default InfoPanel;

import FormatSet from "./FormatSet";

const SubsetSection = ({ subsets, getSC, minSize = 3, underline = false }) => {
  return (
    <div>
      {Object.keys(subsets)
        .map(Number)
        .filter(size => size >= minSize)
        .sort((a, b) => a - b)
        .map(size => {
          const scMap = {};
          subsets[size].forEach(subset => {
            const sc = getSC(subset);
            scMap[sc.join(',')] = sc;
          });
          const uniqueSCs = Object.values(scMap);

          return (
            <div key={size} className="mt-2">
              <p className="font-medium">Size {size}: ({uniqueSCs.length} classes)</p>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-700 ">
                {uniqueSCs.map((sc, idx) => <FormatSet key={idx} arr={sc} braces="[]" underline={underline} />)}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default SubsetSection;
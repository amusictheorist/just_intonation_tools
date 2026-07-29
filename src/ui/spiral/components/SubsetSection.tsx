import type { SubsetGroups } from "../../../lib/spiral/sets";
import FormatSet from "./FormatSet";

type SubsetSectionProps = {
  subsets: SubsetGroups;
  getSC: (subset: readonly number[]) => number[];
  minSize?: number;
  underline?: boolean;
};

function SubsetSection({
  subsets,
  getSC,
  minSize = 3,
  underline = false,
}: SubsetSectionProps) {
  const sizes = Object.keys(subsets)
    .map(Number)
    .filter((size) => size >= minSize)
    .sort((first, second) => first - second);

  return (
    <div>
      {sizes.map((size) => {
        const uniqueClasses = new Map<string, number[]>();

        for (const subset of subsets[size] ?? []) {
          const setClass = getSC(subset);

          uniqueClasses.set(setClass.join(","), setClass);
        }

        const classes = Array.from(uniqueClasses.values());

        return (
          <section key={size} className="mt-3">
            <p className="font-medium">
              Size {size}: ({classes.length} classes)
            </p>

            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-700 sm:grid-cols-3">
              {classes.map((setClass) => (
                <FormatSet
                  key={setClass.join(",")}
                  arr={setClass}
                  braces="[]"
                  underline={underline}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default SubsetSection;

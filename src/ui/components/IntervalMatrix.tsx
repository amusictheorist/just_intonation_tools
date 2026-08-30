import type { Ratio } from "../../lib/ji/ratio/ratio";

type IntervalMatrixProps = {
  members: readonly bigint[];
  matrix: readonly (readonly Ratio[])[];
  kind: "partial" | "partialClass";
};

function IntervalMatrix({ members, matrix, kind }: IntervalMatrixProps) {
  const renderMember = (member: bigint) =>
    kind === "partialClass" ? <u>{member.toString()}</u> : member.toString();

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-sm">
        <thead>
          <tr>
            <th className="p-2" />
            {members.map((member) => (
              <th
                key={member.toString()}
                className="border border-gray-300 p-2 font-semibold"
              >
                {renderMember(member)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={members[rowIndex].toString()}>
              <th className="border border-gray-300 p-2 font-semibold">
                {renderMember(members[rowIndex])}
              </th>

              {row.map((ratio, columnIndex) => (
                <td
                  key={`${rowIndex}-${columnIndex}`}
                  className="border border-gray-300 p-2 text-center"
                >
                  {ratio.numerator.toString()}/{ratio.denominator.toString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IntervalMatrix;

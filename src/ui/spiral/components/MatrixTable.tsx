type MatrixTableProps = {
  elements: number[];
  matrix: string[][];
};

function MatrixTable({ elements, matrix }: MatrixTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="mx-auto border-collapse border border-gray-400 text-sm">
        <thead>
          <tr>
            <th scope="col" className="border border-gray-400 p-1" />

            {elements.map((element) => (
              <th
                key={element}
                scope="col"
                className="border border-gray-400 p-1"
              >
                {element}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={elements[rowIndex]}>
              <th scope="row" className="border border-gray-400 p-1">
                {elements[rowIndex]}
              </th>

              {row.map((cell, columnIndex) => (
                <td
                  key={`${rowIndex}-${columnIndex}`}
                  className="border border-gray-400 p-1 text-center"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MatrixTable;

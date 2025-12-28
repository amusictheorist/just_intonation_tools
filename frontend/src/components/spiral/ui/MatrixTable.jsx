const MatrixTable = ({ elements, matrix }) => (
  <table className="border-collapse border border-gray-400 text-sm mx-auto">
    <thead>
      <tr>
        <th className="border border-gray-400 p-1"></th>
        {elements.map((e, idx) => (
          <th key={idx} className="border border-gray-400 p-1">{e}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {matrix.map((row, i) => (
        <tr key={i}>
          <th className="border border-gray-400 p-1">{elements[i]}</th>
          {row.map((cell, j) => (
            <td key={j} className="border border-gray-400 p-1 text-center">{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default MatrixTable;
type FormatSetProps = {
  arr: readonly number[];
  braces?: "{}" | "[]";
  underline?: boolean;
};

function FormatSet({ arr, braces = "{}", underline = false }: FormatSetProps) {
  const [openBrace, closeBrace] = braces.split("");

  return (
    <span>
      {openBrace}

      {arr.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className={underline ? "underline underline-offset-2" : undefined}
        >
          {value}
          {index < arr.length - 1 ? ", " : ""}
        </span>
      ))}

      {closeBrace}
    </span>
  );
}

export default FormatSet;

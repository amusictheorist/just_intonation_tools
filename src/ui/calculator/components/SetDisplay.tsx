import type { PartialClassSet } from "../../../lib/ji/partialClassSet";
import type { PartialSet } from "../../../lib/ji/partialSet";

type SetDisplayProps = {
  value: PartialSet | PartialClassSet;
  kind: "partial" | "partialClass";
  notation: "set" | "setClass";
};

function SetDisplay({ value, kind, notation }: SetDisplayProps) {
  const openingBracket = notation === "set" ? "{" : "[";
  const closingBracket = notation === "set" ? "}" : "]";

  return (
    <span>
      {openingBracket}
      {value.members.map((member, index) => (
        <span key={member.toString()}>
          {index > 0 && ", "}
          {kind === "partialClass" ? (
            <u>{member.toString()}</u>
          ) : (
            member.toString()
          )}
        </span>
      ))}
      {closingBracket}
    </span>
  );
}

export default SetDisplay;

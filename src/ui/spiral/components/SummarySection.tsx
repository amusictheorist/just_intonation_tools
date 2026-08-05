import FormatSet from "./FormatSet";

type SummarySectionProps = {
  parset: number[];
  parcset: number[];
  parSC: number[];
  parcSC: number[];
  spectralExtP: number;
  spectralExtPC: number;
};

function SummarySection({
  parset,
  parcset,
  parSC,
  parcSC,
  spectralExtP,
  spectralExtPC,
}: SummarySectionProps) {
  return (
    <dl className="space-y-1">
      <div>
        <dt className="inline font-semibold">Partial set: </dt>
        <dd className="inline">
          <FormatSet arr={parset} braces="{}" />
        </dd>
      </div>

      <div>
        <dt className="inline font-semibold">Partial-class set: </dt>
        <dd className="inline">
          <FormatSet arr={parcset} braces="{}" underline />
        </dd>
      </div>

      <div>
        <dt className="inline font-semibold">Partial-set class: </dt>
        <dd className="inline">
          <FormatSet arr={parSC} braces="[]" />
        </dd>
      </div>

      <div>
        <dt className="inline font-semibold">Partial-class set class: </dt>
        <dd className="inline">
          <FormatSet arr={parcSC} braces="[]" underline />
        </dd>
      </div>

      <div>
        <dt className="inline font-semibold">
          Spectral Extension
          <sub>p</sub>:{" "}
        </dt>
        <dd className="inline">{spectralExtP}</dd>
      </div>

      <div>
        <dt className="inline font-semibold">
          Spectral Extension
          <sub>pc</sub>:{" "}
        </dt>
        <dd className="inline">{spectralExtPC}</dd>
      </div>
    </dl>
  );
}

export default SummarySection;

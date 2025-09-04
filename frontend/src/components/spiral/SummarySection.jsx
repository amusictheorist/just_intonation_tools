import FormatSet from "./FormatSet";

const SummarySection = ({ parset, parcset, parSC, parcSC, spectralExtP, spectralExtPC }) => (
  <div className="space-y-1">
    <p><strong>Partial set:</strong> <FormatSet arr={parset} braces="{}" /></p>
    <p><strong>Partial-class set:</strong> <FormatSet arr={parcset} braces="{}" underline='true' /></p>
    <p><strong>Partial-set class:</strong> <FormatSet arr={parSC} braces="[]" /></p>
    <p><strong>Partial-class set class:</strong> <FormatSet arr={parcSC} braces="[]" underline='true' /></p>
    <p><strong>Spectral Extension<sub>p</sub>:</strong> {spectralExtP}</p>
    <p><strong>Spectral Extension<sub>pc</sub>:</strong> {spectralExtPC}</p>
  </div>
);

export default SummarySection;
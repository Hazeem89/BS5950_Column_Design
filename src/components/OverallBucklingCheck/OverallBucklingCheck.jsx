import React, { useEffect } from 'react';
import { useDesign } from '../../context/DesignContext';
import {
  calculateSlendernessRatio,
  calculateEffectiveLength,
  calculatePy,
  calculateCompressionResistance,
  calculateBucklingResistanceMoment,
  calculateEquivalentSlenderness
} from '../../utils/calculations';

const OverallBucklingCheck = () => {
  const {
    designInputs: { Fc, grade, Mx, My, L },
    selectedSection,
    classificationResults,
    bucklingResults,
    setBucklingResults,
    lookupPc,
    lookupPb
  } = useDesign();

  useEffect(() => {
    if (
      !selectedSection ||
      !Fc || isNaN(Number(Fc)) ||
      !Mx || isNaN(Number(Mx)) ||
      !My || isNaN(Number(My)) ||
      !L || isNaN(Number(L)) ||
      !grade || isNaN(Number(grade))
    ) {
      setBucklingResults(null);
      return;
    }

    const {
      Tflange,
      A,
      ry,
      Sx,
      Zx,
      Zy,
    } = selectedSection;

    const sectionClass = classificationResults?.flangeClass || 'Plastic';

    const py = calculatePy(Number(grade), Number(Tflange));
    const LE = calculateEffectiveLength(Number(L));
    const λ = calculateSlendernessRatio(Number(LE), Number(ry));
    const λLT = calculateEquivalentSlenderness(Number(L), Number(ry));

    const pc = lookupPc(λ, py);
    const Pb = lookupPb(λLT, py);

    console.log("λ:", λ, "λLT:", λLT, "py:", py);
    console.log("lookupPc result:", pc);
    console.log("lookupPb result:", Pb);


    // Ensure lookups returned valid values
    if (pc === null || Pb === null) {
      setBucklingResults(null);
      return;
    }

    const Pc = calculateCompressionResistance(sectionClass, pc, Number(A));
    const Mbs = calculateBucklingResistanceMoment(sectionClass, Pb, Number(Sx), Number(Zx));

    const OverallBucklingCheck = (Number(Fc) / Pc) + (Number(Mx) / Mbs) + (Number(My) * 1000 / (py * Zy));

    setBucklingResults({
      py,
      LE,
      λ,
      Pc,
      λLT,
      Mbs,
      OverallBucklingCheck,
    });

  }, [selectedSection, Fc, grade, Mx, My, L, classificationResults, lookupPc, lookupPb, setBucklingResults]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Overall Buckling Check Results</h2>
      {bucklingResults ? (
        <div>
          <p><strong>Design Strength (py):</strong> {bucklingResults.py.toFixed(2)} MPa</p>
          <p><strong>Effective Length (LE):</strong> {bucklingResults.LE.toFixed(2)} m</p>
          <p><strong>Slenderness Ratio (λ):</strong> {bucklingResults.λ.toFixed(2)}</p>
          <p><strong>Compression Resistance (Pc):</strong> {bucklingResults.Pc.toFixed(2)}</p>
          <p><strong>Equivalent Slenderness (λLT):</strong> {bucklingResults.λLT.toFixed(2)}</p>
          <p><strong>Buckling Resistance Moment (Mbs):</strong> {bucklingResults.Mbs.toFixed(2)} kNm</p>
          <p><strong>Overall Buckling Check:</strong> {bucklingResults.OverallBucklingCheck.toFixed(2)}</p>
        </div>
      ) : (
        <p className="text-red-500">No results available. Please check your inputs or data.</p>
      )}
    </div>
  );
};

export default OverallBucklingCheck;

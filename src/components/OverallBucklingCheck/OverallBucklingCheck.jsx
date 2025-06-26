import React, { useEffect } from "react";
import { useDesign } from "../../context/DesignContext";
import {
  calculateSlendernessRatio,
  calculateEffectiveLength,
  calculatePy,
  calculateCompressionResistance,
  calculateBucklingResistanceMoment,
  calculateEquivalentSlenderness,
} from "../../utils/calculations";

const OverallBucklingCheck = () => {
  const {
    designInputs: { Fc, grade, Mx, My, L },
    selectedSection,
    classificationResults,
    bucklingResults,
    setBucklingResults,
    lookupPc,
    lookupPb,
  } = useDesign();

  useEffect(() => {
    if (
      !selectedSection ||
      !Fc ||
      isNaN(Number(Fc)) ||
      !Mx ||
      isNaN(Number(Mx)) ||
      !My ||
      isNaN(Number(My)) ||
      !L ||
      isNaN(Number(L)) ||
      !grade ||
      isNaN(Number(grade))
    ) {
      setBucklingResults(null);
      return;
    }

    const { Tflange, A, ry, Sx, Zx, Zy } = selectedSection;

    const sectionClass = classificationResults?.flangeClass || "Plastic";

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
    const Mbs = calculateBucklingResistanceMoment(
      sectionClass,
      Pb,
      Number(Sx),
      Number(Zx)
    );

    const OverallBucklingCheck =
      Number(Fc) / Pc + Number(Mx) / Mbs + (Number(My) * 1000) / (py * Zy);

    setBucklingResults({
      py,
      LE,
      λ,
      Pc,
      λLT,
      Mbs,
      OverallBucklingCheck,
    });
  }, [
    selectedSection,
    Fc,
    grade,
    Mx,
    My,
    L,
    classificationResults,
    lookupPc,
    lookupPb,
    setBucklingResults,
  ]);

  return (
    <fieldset className="p-6 max-w-6xl mx-auto bg-[#fffac0] border border-gray-200 rounded-lg mb-6 shadow-sm">
      <legend className="text-2xl font-semibold text-gray-200 mb-4 bg-[#2691d4ef] p-2 rounded-lg shadow-md">
        Overall Buckling Check
      </legend>
      {bucklingResults ? (
        <div className="space-y-4 text-gray-700">
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">
              Design Strength (py):
            </span>
            <span>{bucklingResults.py.toFixed(2)} MPa</span>
          </p>
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">
              Effective Length (LE):
            </span>
            <span>{bucklingResults.LE.toFixed(2)} m</span>
          </p>
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">
              Slenderness Ratio (λ):
            </span>
            <span>{bucklingResults.λ.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">
              Compression Resistance (Pc):
            </span>
            <span>{bucklingResults.Pc.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">
              Equivalent Slenderness (λLT):
            </span>
            <span>{bucklingResults.λLT.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">
              Buckling Resistance Moment (Mbs):
            </span>
            <span>{bucklingResults.Mbs.toFixed(2)} kNm</span>
          </p>
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">
              Overall Buckling Check:
            </span>
            <span
              className={`font-medium text-sm ${
                bucklingResults.OverallBucklingCheck <= 1
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {bucklingResults.OverallBucklingCheck.toFixed(2)}
            </span>
          </p>

          {/* Conditional message */}
          {bucklingResults.OverallBucklingCheck <= 1 ? (
            <p className="text-green-600 font-medium">
              Overall buckling check {"<"} 1 and section is OK!
            </p>
          ) : (
            <p className="text-red-600 font-medium">
              Not OK! Overall buckling check {">"} 1. Please review your inputs and/or select another section.
            </p>
          )}
        </div>
      ) : (
        <p className="text-red-600 font-medium">
          Please select a section and enter valid design inputs.
        </p>
      )}
    </fieldset>
  );
};

export default OverallBucklingCheck;

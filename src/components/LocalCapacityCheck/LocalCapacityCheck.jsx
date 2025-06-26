import React, { useEffect } from "react";
import { useDesign } from "../../context/DesignContext";
import {
  calculateMcx,
  calculateMcy,
  calculatePy,
} from "../../utils/calculations";

const LocalCapacityCheck = () => {
  const {
    designInputs: { Fc, grade, Mx, My, L },
    selectedSection,
    capacityResults,
    setCapacityResults,
    classificationResults,
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
      setCapacityResults(null);
      return;
    }

    const { Tflange, A, Sx, Sy, Zx, Zy } = selectedSection;

    const sectionClass = classificationResults?.flangeClass || "Plastic"; // fallback if not defined
    const py = calculatePy(Number(grade), Number(Tflange));
    const Mcx = calculateMcx(sectionClass, py, Number(Sx), Number(Zx));
    const Mcy = calculateMcy(sectionClass, py, Number(Sy), Number(Zy));
    const capacity = (Fc * 10) / (py * A) + Mx / Mcx + My / Mcy; // Cross-section capacity BS5950:2000 Clause 4.8.3.2

    setCapacityResults({
      py,
      Mcx,
      Mcy,
      capacity,
    });
  }, [selectedSection, Fc, grade, Mx, My, L, setCapacityResults]);

  return (
    <fieldset className="p-6 max-w-6xl mx-auto border border-gray-200 rounded-lg mb-6 shadow-sm">
      <legend className="text-2xl font-semibold text-gray-800 mb-4">
        Local Capacity Check Results
      </legend>
      {capacityResults ? (
        <div className="space-y-4 text-gray-700">
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">
              Design Strength (py):
            </span>{" "}
            <span>{capacityResults.py.toFixed(2)} MPa</span>
          </p>
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">
              Major Axis Moment Capacity (Mcx):
            </span>{" "}
            <span>{capacityResults.Mcx.toFixed(2)} kNm</span>
          </p>
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">
              Minor Axis Moment Capacity (Mcy):
            </span>{" "}
            <span>{capacityResults.Mcy.toFixed(2)} kNm</span>
          </p>
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">
              Capacity Ratio:
            </span>{" "}
            <span
              className={`font-medium text-sm ${
                capacityResults.capacity <= 1
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {capacityResults.capacity.toFixed(2)}
            </span>
          </p>

          {/* Conditional message */}
          {capacityResults.capacity <= 1 ? (
            <p className="text-green-600 font-medium">
              Capacity ratio is acceptable.
            </p>
          ) : (
            <p className="text-red-600 font-medium">
              Warning: Capacity ratio exceeds 1. Please review your inputs.
            </p>
          )}
        </div>
      ) : (
        <p className="text-red-600 font-medium">
          Please ensure all inputs are valid.
        </p>
      )}
    </fieldset>
  );
};

export default LocalCapacityCheck;

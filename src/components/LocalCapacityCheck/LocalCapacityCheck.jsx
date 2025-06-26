import React, { useEffect } from 'react';
import { useDesign } from '../../context/DesignContext';
import { calculateMcx, calculateMcy, calculatePy } from '../../utils/calculations';


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
      !Fc || isNaN(Number(Fc)) ||
      !Mx || isNaN(Number(Mx)) ||
      !My || isNaN(Number(My)) ||
      !L || isNaN(Number(L)) ||
      !grade || isNaN(Number(grade))
    ) {
      setCapacityResults(null);
      return;
    }

    const {
      Tflange,
      A,
      Sx,
      Sy,
      Zx,
      Zy,
    } = selectedSection;

    const sectionClass = classificationResults?.flangeClass || 'Plastic'; // fallback if not defined
    const py = calculatePy(Number(grade), Number(Tflange));
    const Mcx = calculateMcx(sectionClass, py, Number(Sx), Number(Zx));
    const Mcy = calculateMcy(sectionClass, py, Number(Sy), Number(Zy));
    const capacity = (Fc * 10 / (py * A)) + (Mx / Mcx) + (My / Mcy); // Cross-section capacity BS5950:2000 Clause 4.8.3.2

    setCapacityResults({
      py,
      Mcx,
      Mcy,
      capacity,
    });

  }, [selectedSection, Fc, grade, Mx, My, L, setCapacityResults]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Local Capacity Check Results</h2>
      {capacityResults ? (
        <div>
            <p><strong>Design Strength (py):</strong> {capacityResults.py.toFixed(2)} MPa</p>
          <p><strong>Major Axis Moment Capacity (Mcx):</strong> {capacityResults.Mcx.toFixed(2)} kNm</p>
          <p><strong>Minor Axis Moment Capacity (Mcy):</strong> {capacityResults.Mcy.toFixed(2)} kNm</p>
          <p><strong>Capacity Ratio:</strong> {capacityResults.capacity.toFixed(2)}</p>
        </div>
      ) : (
        <p className="text-red-500">Please ensure all inputs are valid.</p>
      )}
    </div>
  );
};

export default LocalCapacityCheck;

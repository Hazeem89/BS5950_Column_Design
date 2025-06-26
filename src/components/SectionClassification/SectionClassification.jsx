import React, { useEffect } from "react";
import { useDesign } from "../../context/DesignContext";
import {
  calculatePy,
  calculateEpsilon,
  classifyFlange,
  calculateR1,
  calculateR2,
  classifyWeb,
  classifySection,
} from "../../utils/classification";

const SectionClassification = () => {
  const {
    designInputs: { Fc, grade },
    selectedSection,
    classificationResults,
    setClassificationResults,
  } = useDesign();

  useEffect(() => {
    // Validate inputs presence and convert to numbers
    if (
      !selectedSection ||
      !Fc ||
      isNaN(Number(Fc)) ||
      !grade ||
      isNaN(Number(grade))
    ) {
      setClassificationResults(null);
      return;
    }

    // Destructure properties from selectedSection
    const {
      Tflange,
      bT,
      d,
      tWeb,
      A,
      dt, // make sure dt exists in your section data
    } = selectedSection;

    // Step 1: Calculate design strength py
    const py = calculatePy(Number(grade), Number(Tflange));

    // Step 2: Calculate epsilon
    const epsilon = calculateEpsilon(py);

    // Step 3: Classify flange
    const flangeClass = classifyFlange(Number(bT), Number(Tflange), epsilon);

    // Step 4 & 5: Calculate r1 and r2
    const r1 = calculateR1(Number(Fc), Number(d), Number(tWeb), py);
    const r2 = calculateR2(Number(Fc), Number(A), py);

    // Step 6: Classify web
    const webClass = classifyWeb(Number(dt), r1, r2, epsilon);

    // Step 7: Classify section (based on flange and web classification)
    const sectionClass = classifySection(flangeClass, webClass);

    // Save results in context
    setClassificationResults({
      py,
      epsilon,
      flangeClass,
      r1,
      r2,
      webClass,
      sectionClass,
    });
  }, [selectedSection, Fc, grade, setClassificationResults]);

  return (
    <fieldset className="p-6 max-w-6xl mx-auto border border-gray-200 rounded-lg mb-6 shadow-sm">
      <legend className="text-2xl font-semibold text-gray-800 mb-4">
        Section Classification
      </legend>

      {classificationResults ? (
        <div className="space-y-4 text-gray-700">
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Design Strength (py):</span>
            <span>{classificationResults.py.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Epsilon:</span>
            <span>{classificationResults.epsilon.toFixed(3)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Flange Classification:</span>
            <span>{classificationResults.flangeClass}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">r1:</span>
            <span>{classificationResults.r1.toFixed(3)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">r2:</span>
            <span>{classificationResults.r2.toFixed(3)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Web Classification:</span>
            <span>{classificationResults.webClass}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Section Classification:</span>
            <span>{classificationResults.sectionClass}</span>
          </p>
        </div>
      ) : (
        <p className="text-red-600 font-medium">
          Please select a section and enter valid design inputs.
        </p>
      )}
    </fieldset>
  );
};

export default SectionClassification;

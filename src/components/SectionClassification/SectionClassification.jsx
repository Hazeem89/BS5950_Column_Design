import React, { useEffect } from 'react';
import { useDesign } from '../../context/DesignContext';
import {
  calculatePy,
  calculateEpsilon,
  classifyFlange,
  calculateR1,
  calculateR2,
  classifyWeb,
  classifySection,
} from '../../utils/classification';

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
      !Fc || isNaN(Number(Fc)) ||
      !grade || isNaN(Number(grade))
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
      dt,  // make sure dt exists in your section data
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
    <div>
      <h2>Section Classification</h2>
      {classificationResults ? (
        <ul>
          <li>Design Strength py: {classificationResults.py.toFixed(2)}</li>
          <li>Epsilon: {classificationResults.epsilon.toFixed(3)}</li>
          <li>Flange Classification: {classificationResults.flangeClass}</li>
          <li>r1: {classificationResults.r1.toFixed(3)}</li>
          <li>r2: {classificationResults.r2.toFixed(3)}</li>
          <li>Web Classification: {classificationResults.webClass}</li>
          <li>Section Classification: {classificationResults.sectionClass}</li>
        </ul>
      ) : (
        <p>Please select a section and enter valid design inputs.</p>
      )}
    </div>
  );
};

export default SectionClassification;

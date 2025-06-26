import React, { useEffect, useState } from "react";
import { useDesign } from "../../context/DesignContext";
import ucSections from "../../data/uc_sections.json";

const SectionSelection = () => {
  const { selectedSection, setSelectedSection } = useDesign();
  const [sectionName, setSectionName] = useState("");

  const handleChange = (e) => {
    const name = e.target.value;
    setSectionName(name);
    const section = ucSections.find((sec) => sec.name === name);
    setSelectedSection(section);
  };

  return (
    <fieldset className="p-6 max-w-6xl mx-auto border border-gray-200 rounded-lg mb-6 shadow-sm">
      <legend className="text-2xl font-semibold text-gray-800 mb-4">
        Section Selection
      </legend>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Section
      </label>

      <select
        className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={sectionName}
        onChange={handleChange}
      >
        <option value="">-- Select a Section --</option>
        {ucSections.map((section) => (
          <option key={section.name} value={section.name}>
            {section.name}
          </option>
        ))}
      </select>

      {selectedSection && (
        <div className="mt-6 space-y-4 text-sm text-gray-700">
          <p>
            <span className="text-sm font-medium text-gray-700 mr-2">Depth:</span> {selectedSection.d} mm
          </p>
          <p>
            <span className="text-sm font-medium text-gray-700 mr-2">Web Thickness:</span>{" "}
            {selectedSection.tWeb} mm
          </p>
          <p>
            <span className="text-sm font-medium text-gray-700 mr-2">Flange Thickness:</span>{" "}
            {selectedSection.Tflange} mm
          </p>
          <p>
            <span className="text-sm font-medium text-gray-700 mr-2">Area:</span> {selectedSection.A} mm²
          </p>
          <p>
            <span className="text-sm font-medium text-gray-700 mr-2">
              Major Axis Section Modulus (Sx):
            </span>{" "}
            {selectedSection.Sx} mm³
          </p>
          <p>
            <span className="text-sm font-medium text-gray-700 mr-2">
              Minor Axis Section Modulus (Sy):
            </span>{" "}
            {selectedSection.Sy} mm³
          </p>
          <p>
            <span className="text-sm font-medium text-gray-700 mr-2">
              Major Axis Plastic Section Modulus (Zx):
            </span>{" "}
            {selectedSection.Zx} mm³
          </p>
          <p>
            <span className="text-sm font-medium text-gray-700 mr-2">
              Minor Axis Plastic Section Modulus (Zy):
            </span>{" "}
            {selectedSection.Zy} mm³
          </p>
        </div>
      )}
    </fieldset>
  );
};

export default SectionSelection;

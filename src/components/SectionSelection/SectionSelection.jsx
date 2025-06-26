import React, { useEffect, useState } from 'react';
import { useDesign } from '../../context/DesignContext';
import ucSections from '../../data/uc_sections.json';

const SectionSelection = () => {
  const { selectedSection, setSelectedSection } = useDesign();
  const [sectionName, setSectionName] = useState('');

  const handleChange = (e) => {
    const name = e.target.value;
    setSectionName(name);
    const section = ucSections.find((sec) => sec.name === name);
    setSelectedSection(section);
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Section Selection</h2>
      <label className="block text-sm font-medium mb-1">Select Section</label>
      <select
        className="w-full border px-2 py-1 rounded"
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
        <div className="mt-4 text-sm text-gray-700">
          <p><strong>Depth:</strong> {selectedSection.d} mm</p>
          <p><strong>Web Thickness:</strong> {selectedSection.tWeb} mm</p>
          <p><strong>Flange Thickness:</strong> {selectedSection.Tflange} mm</p>
          {/* Add more preview fields if needed */}
        </div>
      )}
    </div>
  );
};

export default SectionSelection;
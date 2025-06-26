import React, { useEffect, useState } from "react";
import { useDesign } from "../../context/DesignContext";
import ucSections from "../../data/uc_sections.json";
import SectionImage from "../../assets/Section.png";

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
    <fieldset className="p-6 max-w-6xl mx-auto bg-[#fffac0] border border-gray-200 rounded-lg mb-6 shadow-md">
      <legend className="text-2xl font-semibold text-gray-200 mb-4 bg-[#2691d4ef] p-2 rounded-lg shadow-md">
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
        <div className="mt-1 text-sm text-gray-700  p-4 rounded-md flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-4 text-sm text-gray-700  p-4 rounded-md">
            <p>
              <span className="text-sm font-medium text-gray-700 mr-2">
                Depth between fillets (d):
              </span>{" "}
              {selectedSection.d} mm
            </p>
            <p>
              <span className="text-sm font-medium text-gray-700 mr-2">
                Web Thickness (t):
              </span>{" "}
              {selectedSection.tWeb} mm
            </p>
            <p>
              <span className="text-sm font-medium text-gray-700 mr-2">
                Flange Thickness (T):
              </span>{" "}
              {selectedSection.Tflange} mm
            </p>
            <p>
              <span className="text-sm font-medium text-gray-700 mr-2">
                Area of section (A):
              </span>{" "}
              {selectedSection.A} cm²
            </p>
            <p>
              <span className="text-sm font-medium text-gray-700 mr-2">
                Plastic modulus major axis (Sx):
              </span>{" "}
              {selectedSection.Sx} cm³
            </p>
            <p>
              <span className="text-sm font-medium text-gray-700 mr-2">
                Plastic modulus minor axis (Sy):
              </span>{" "}
              {selectedSection.Sy} cm³
            </p>
            <p>
              <span className="text-sm font-medium text-gray-700 mr-2">
                Elastic modulus major axis (Zx):
              </span>{" "}
              {selectedSection.Zx} cm³
            </p>
            <p>
              <span className="text-sm font-medium text-gray-700 mr-2">
                Elastic modulus minor axis (Zy):
              </span>{" "}
              {selectedSection.Zy} cm³
            </p>
          </div>
          <div className="space-y-4 text-sm text-gray-700  p-4 rounded-md">
            <div className="relative rounded-2xl" >
              <img
                src={SectionImage}
                alt="Section"
                className="w-[300px] h-auto rounded-md"
              />

              {/* Overlay text spans */}
              <span className="absolute top-7 left-26 bg-[#fffac0] px-1 text-s font-medium">
                B= {selectedSection.B}
              </span>
              <span className="absolute top-30 leftt-4 bg-[#fffac0] px-1 text-s font-medium">
                D= {selectedSection.Dtotal}
              </span>
              <span className="absolute top-25 left-40 bg-[#fffac0] px-1 text-s font-medium">
                t= {selectedSection.tWeb}
              </span>
              <span className="absolute top-30 left-55 bg-[#fffac0] px-1 text-s font-medium">
                d= {selectedSection.d}
              </span>
              <span className="absolute top-38 left-13 bg-[#fffac0] px-1 text-s font-medium">
                T= {selectedSection.Tflange}
              </span>
            </div>
          </div>
        </div>
      )}
    </fieldset>
  );
};

export default SectionSelection;

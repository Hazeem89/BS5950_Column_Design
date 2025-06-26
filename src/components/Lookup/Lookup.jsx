import React, { useState } from "react";
import PcLookup from "../PcLookup/PcLookup";
import PbLookup from "../PbLookup/PbLookup";

const Lookup = () => {
  // State to control the visibility of the content inside the fieldset
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the visibility
  const toggleVisibility = () => {
    setIsOpen(!isOpen);
  };

  return (
    <fieldset className="p-6 max-w-6xl mx-auto bg-[#fffac0] border border-gray-200 rounded-lg mb-6 shadow-sm">
      <legend
        className="text-2xl font-semibold text-gray-200 mb-4 bg-[#2691d4ef] p-2 rounded-lg shadow-md cursor-pointer"
        onClick={toggleVisibility}
      >
        Manually Lookup
      </legend>

      {/* Conditionally show the content based on the isOpen state */}
      <div className={`flex space-x-8 ${isOpen ? "" : "hidden"}`}>
        <div className="flex-1">
          <PcLookup />
        </div>
        <div className="flex-1">
          <PbLookup />
        </div>
      </div>
    </fieldset>
  );
};

export default Lookup;

import React, { useState } from "react";

const AboutApp = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-4 border border-gray-300 rounded-md bg-white shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-4 py-2 font-semibold text-blue-600 hover:underline focus:outline-none"
      >
        ℹ️ About this app
      </button>

      {isOpen && (
        <div className="px-4 py-3 text-sm text-gray-700 space-y-2">
          <p>
            This application performs section classification and strength checks
            for UC steel sections according to <strong>BS 5950</strong>.
          </p>

          <ul className="list-disc list-inside pl-2">
            <li>
              <strong>Clause 4.7.7</strong>: Columns in simple structures
            </li>
            <li>
              <strong>Clause 4.8.3.2</strong>: Cross-section capacity for
              compression members with moments
            </li>
            <li>
              <strong>Effective length</strong>: Used effective length factor is
              0.85.
            </li>
          </ul>

          <p>
            <strong>Disclaimer:</strong> This app does{" "}
            <span className="text-red-600 font-semibold">
              not support slender section design
            </span>
            .
          </p>

          <p>
            It is intended for{" "}
            <strong>educational and preliminary design use only</strong>.
          </p>
          <p>
            For full structural design, verification using professional
            engineering tools is essential.
          </p>

          <p>* - required inputs</p>
        </div>
      )}
    </div>
  );
};

export default AboutApp;

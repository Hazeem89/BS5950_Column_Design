import React, { useContext } from "react";
import { useDesign } from "../../context/DesignContext";

const InputDesignData = () => {
  const { designInputs, setDesignInputs } = useDesign();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDesignInputs({ ...designInputs, [name]: value });
  };

  return (
    <fieldset className="p-6 max-w-6xl mx-auto bg-[#fffac0] border border-gray-200 rounded-lg mb-6 shadow-md">
      <legend className="text-2xl font-semibold text-gray-200 bg-[#2691d4ef] p-2 rounded-lg shadow-md mb-4">
        Input Design Data
      </legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        <div className="flex flex-col w-full">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Axial Force Fc (kN):
          </label>
          <input
            type="number"
            name="Fc"
            value={designInputs.Fc}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Moment Mx (kNm):
          </label>
          <input
            type="number"
            name="Mx"
            value={designInputs.Mx}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Moment My (kNm):
          </label>
          <input
            type="number"
            name="My"
            value={designInputs.My}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Length L (m):
          </label>
          <input
            type="number"
            name="L"
            value={designInputs.L}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Steel Grade:
          </label>
          <select
            name="grade"
            value={designInputs.grade}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select grade</option>
            <option value={275}>275</option>
            <option value={355}>355</option>
            <option value={460}>460</option>
          </select>
        </div>
      </div>
    </fieldset>
  );
};

export default InputDesignData;

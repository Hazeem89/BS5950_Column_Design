import React, { useContext } from 'react';
import { useDesign } from '../../context/DesignContext';

const InputDesignData = () => {
  const { designInputs, setDesignInputs } = useDesign();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDesignInputs({ ...designInputs, [name]: value });
  };

  return (
    <div className="p-4 border rounded mb-4">
      <h2 className="text-xl font-semibold mb-2">Input Design Data</h2>
      <div className="grid grid-cols-2 gap-4">
        <label>
          Axial Force Fc (kN):
          <input
            type="number"
            name="Fc"
            value={designInputs.Fc}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </label>

        <label>
          Moment Mx (kNm):
          <input
            type="number"
            name="Mx"
            value={designInputs.Mx}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </label>

        <label>
          Moment My (kNm):
          <input
            type="number"
            name="My"
            value={designInputs.My}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </label>

        <label>
          Length L (m):
          <input
            type="number"
            name="L"
            value={designInputs.L}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </label>

        <label>
          Steel Grade:
          <select
            name="grade"
            value={designInputs.grade}
            onChange={handleChange}
            className="border p-1 w-full"
          >
            <option value="">Select grade</option>
            <option value={275}>275</option>
            <option value={355}>355</option>
            <option value={460}>460</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default InputDesignData;

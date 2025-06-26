import React, { useState, useEffect } from "react";
import { useDesign } from "../../context/DesignContext";

const PcLookup = () => {
  const [data, setData] = useState({});
  const [lambda, setLambda] = useState("");
  const [py, setPy] = useState("");
  const [pc, setpc] = useState("");
  const { setPcLookupResult } = useDesign();

  // Load JSON on mount
  useEffect(() => {
    fetch("/src/data/compressive_strength_table.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Failed to load JSON:", err));
  }, []);

  const lookup = () => {
    const pyKey = py.toString();
    const lambdaNum = parseFloat(lambda);

    // Ensure lambdaNum is a valid number
    if (isNaN(lambdaNum)) {
      setpc("Invalid λ value.");
      return;
    }

    // Get sorted lambda keys
    const lambdaKeys = Object.keys(data)
      .map(Number)
      .sort((a, b) => a - b);

    // Clamp λ to the minimum value if it's less than the smallest key
    const minLambda = lambdaKeys[0];
    const maxLambda = lambdaKeys[lambdaKeys.length - 1];
    const clampedLambda = Math.max(lambdaNum, minLambda);

    // Find two surrounding lambda values
    let lower = null,
      upper = null;
    for (let i = 0; i < lambdaKeys.length - 1; i++) {
      if (clampedLambda === lambdaKeys[i]) {
        lower = upper = lambdaKeys[i];
        break;
      }
      if (clampedLambda > lambdaKeys[i] && clampedLambda < lambdaKeys[i + 1]) {
        lower = lambdaKeys[i];
        upper = lambdaKeys[i + 1];
        break;
      }
    }

    // Handle edge case where λ equals maxLambda
    if (clampedLambda === maxLambda) {
      lower = upper = maxLambda;
    }

    if (lower === null || !data[lower]?.[pyKey] || !data[upper]?.[pyKey]) {
      setpc("Value not found or out of range.");
      return;
    }

    if (lower === upper) {
      // Exact match
      setpc(data[lower][pyKey] + " MPa");
    } else {
      // Linear interpolation
      const pcLower = parseFloat(data[lower][pyKey]);
      const pcUpper = parseFloat(data[upper][pyKey]);
      const interpolated =
        pcLower +
        ((clampedLambda - lower) / (upper - lower)) * (pcUpper - pcLower);
      setpc(interpolated.toFixed(2) + " MPa (interpolated)");
    }

    // Set the result in the context
    setPcLookupResult(pc);
  };

  return (
    <div className="p-6 border border-gray-200 rounded-lg mb-6 shadow-sm">
      <h3 className="text-l font-semibold text-gray-800 mb-4">
        Compressive Strength (pc)
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            slenderness ratio (λ):
          </label>
          <input
            type="number"
            value={lambda}
            onChange={(e) => setLambda(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            design strength (py):
          </label>
          <input
            type="number"
            value={py}
            onChange={(e) => setPy(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={lookup}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Lookup
        </button>

        <p className="text-sm text-gray-700 mt-4">
          pc: {pc ? `${pc}` : "Enter values to lookup."}
        </p>
      </div>
    </div>
  );
};

export default PcLookup;

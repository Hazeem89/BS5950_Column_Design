import React, { useState, useEffect } from "react";
import { useDesign } from "../../context/DesignContext";

const PbLookup = () => {
  const [data, setData] = useState({});
  const [lambda, setLambda] = useState("");
  const [py, setPy] = useState("");
  const [Pb, setPb] = useState("");
  const { setPbLookupResult } = useDesign();

  // Load JSON on mount
  useEffect(() => {
    fetch("/src/data/bending_strength_table.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Failed to load JSON:", err));
  }, []);

  const lookup = () => {
    const pyKey = py.toString();
    let lambdaNum = parseFloat(lambda);

    const lambdaKeys = Object.keys(data)
      .map(Number)
      .sort((a, b) => a - b);

    // ✅ Clamp to minimum if below range
    const minLambda = lambdaKeys[0];
    if (lambdaNum < minLambda) {
      lambdaNum = minLambda;
    }

    // Find two surrounding lambda values
    let lower = null,
      upper = null;
    for (let i = 0; i < lambdaKeys.length - 1; i++) {
      if (lambdaNum === lambdaKeys[i]) {
        lower = upper = lambdaKeys[i];
        break;
      }
      if (lambdaNum > lambdaKeys[i] && lambdaNum < lambdaKeys[i + 1]) {
        lower = lambdaKeys[i];
        upper = lambdaKeys[i + 1];
        break;
      }
    }

    // ✅ Handle edge case where λ equals max key
    if (lambdaNum === lambdaKeys[lambdaKeys.length - 1]) {
      lower = upper = lambdaNum;
    }

    if (lower === null || !data[lower]?.[pyKey] || !data[upper]?.[pyKey]) {
      setPb("Value not found or out of range.");
      return;
    }

    if (lower === upper) {
      // Exact match or clamped
      setPb(data[lower][pyKey] + " MPa");
      setPbLookupResult(parseFloat(data[lower][pyKey]));
    } else {
      // Interpolated
      const PbLower = parseFloat(data[lower][pyKey]);
      const PbUpper = parseFloat(data[upper][pyKey]);
      const interpolated =
        PbLower + ((lambdaNum - lower) / (upper - lower)) * (PbUpper - PbLower);
      const interpolatedValue = parseFloat(interpolated.toFixed(2));
      setPb(interpolatedValue + " MPa (interpolated)");
      setPbLookupResult(interpolatedValue);
    }
  };

  return (
    <div className="p-6 border border-gray-200 rounded-lg mb-6 shadow-sm">
      <h3 className="text-l font-semibold text-gray-800 mb-4">
        Bending Strength Lookup (Pb)
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Equivalent slenderness (λLT) :
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
          Pb: {Pb ? `${Pb}` : "Enter values to lookup."}
        </p>
      </div>
    </div>
  );
};

export default PbLookup;

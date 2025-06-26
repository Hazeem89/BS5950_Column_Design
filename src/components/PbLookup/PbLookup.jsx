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
    <div>
      <h2>Pb Bending Strength Lookup</h2>
      <label>
        Equivalent slenderness (lateral-torsional buckling) λLT (lambda):
        <input
          type="number"
          value={lambda}
          onChange={(e) => setLambda(e.target.value)}
        />
      </label>
      <br />
      <label>
        py (design strength):
        <input
          type="number"
          value={py}
          onChange={(e) => setPy(e.target.value)}
        />
      </label>
      <br />
      <button onClick={lookup}>Lookup</button>
      <p>Pb: {Pb ? `${Pb}` : "Enter values to lookup."}</p>
    </div>
  );
};

export default PbLookup;

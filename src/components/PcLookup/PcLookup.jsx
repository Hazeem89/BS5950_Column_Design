import React, { useState, useEffect } from "react";

const PcLookup = () => {
  const [data, setData] = useState({});
  const [lambda, setLambda] = useState("");
  const [py, setPy] = useState("");
  const [result, setResult] = useState("");

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

  // Get sorted lambda keys
  const lambdaKeys = Object.keys(data).map(Number).sort((a, b) => a - b);

  // Find two surrounding lambda values
  let lower = null, upper = null;
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

  if (lower === null || !data[lower]?.[pyKey] || !data[upper]?.[pyKey]) {
    setResult("Value not found or out of range.");
    return;
  }

  if (lower === upper) {
    // Exact match
    setResult(data[lower][pyKey] + " MPa");
  } else {
    // Linear interpolation
    const pcLower = parseFloat(data[lower][pyKey]);
    const pcUpper = parseFloat(data[upper][pyKey]);
    const interpolated = pcLower + ((lambdaNum - lower) / (upper - lower)) * (pcUpper - pcLower);
    setResult(interpolated.toFixed(2) + " MPa (interpolated)");
  }
};


  return (
    <div>
      <h2>Compressive Strength Lookup</h2>
      <label>
        λ (lambda):
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
      <p>Result: {result ? `${result} MPa` : "Enter values to lookup."}</p>
    </div>
  );
};

export default PcLookup;
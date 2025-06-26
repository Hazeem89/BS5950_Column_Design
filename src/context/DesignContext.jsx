import React, { createContext, useContext, useState, useEffect } from 'react';

const DesignContext = createContext();

export const DesignProvider = ({ children }) => {
  const [designInputs, setDesignInputs] = useState({ Fc: '', Mx: '', My: '', grade: '', L: '' });
  const [selectedSection, setSelectedSection] = useState(null);
  const [classificationResults, setClassificationResults] = useState(null);
  const [capacityResults, setCapacityResults] = useState(null);
  const [bucklingResults, setBucklingResults] = useState(null);
  const [pcLookupResult, setPcLookupResult] = useState(null);
  const [PbLookupResult, setPbLookupResult] = useState(null);
  const [compressiveData, setCompressiveData] = useState({}); // <-- new

  // Load compressive strength JSON
  useEffect(() => {
    fetch("/src/data/compressive_strength_table.json")
      .then((res) => res.json())
      .then((json) => setCompressiveData(json))
      .catch((err) => console.error("Failed to load compressive strength data:", err));
  }, []);

  // Core logic to look up pc based on λ and py
  const lookupPc = (lambda, py) => {
    if (!compressiveData || Object.keys(compressiveData).length === 0) return null;

    const pyKey = py.toString();
    const lambdaNum = parseFloat(lambda);
    const lambdaKeys = Object.keys(compressiveData).map(Number).sort((a, b) => a - b);

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

    if (lower === null || !compressiveData[lower]?.[pyKey] || !compressiveData[upper]?.[pyKey]) {
      return null;
    }

    if (lower === upper) {
      return parseFloat(compressiveData[lower][pyKey]);
    } else {
      const pcLower = parseFloat(compressiveData[lower][pyKey]);
      const pcUpper = parseFloat(compressiveData[upper][pyKey]);
      const interpolated = pcLower + ((lambdaNum - lower) / (upper - lower)) * (pcUpper - pcLower);
      return parseFloat(interpolated.toFixed(2));
    }
  };

  return (
    <DesignContext.Provider
      value={{
        designInputs,
        setDesignInputs,
        selectedSection,
        setSelectedSection,
        classificationResults,
        setClassificationResults,
        capacityResults,
        setCapacityResults,
        bucklingResults,
        setBucklingResults,
        pcLookupResult,
        setPcLookupResult,
        PbLookupResult,
        setPbLookupResult,
        lookupPc, // <-- Expose the new function
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => useContext(DesignContext);

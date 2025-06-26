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

  const [compressiveData, setCompressiveData] = useState({});
  const [bendingData, setBendingData] = useState({});

  // Load compressive strength JSON (for Pc)
  useEffect(() => {
    fetch("/src/data/compressive_strength_table.json")
      .then((res) => res.json())
      .then((json) => setCompressiveData(json))
      .catch((err) => console.error("Failed to load compressive strength data:", err));
  }, []);

  // Load bending strength JSON (for Pb)
  useEffect(() => {
    fetch("/src/data/bending_strength_table.json")
      .then((res) => res.json())
      .then((json) => setBendingData(json))
      .catch((err) => console.error("Failed to load bending strength data:", err));
  }, []);

  // Lookup Pc from lambda and py
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

  // Lookup Pb from lambdaLT and py
  const lookupPb = (lambda, py) => {
  if (!bendingData || typeof lambda !== 'number' || typeof py !== 'number') return null;

  const pyKey = py.toString();
  const lambdaKeys = Object.keys(bendingData).map(Number).sort((a, b) => a - b);

  if (lambdaKeys.length === 0) return null;

  // ✅ Clamp lambda to min if it's too small
  let lambdaNum = Math.max(lambda, lambdaKeys[0]);

  let lower = null, upper = null;

  // ✅ Handle exact match with max key
  if (lambdaNum === lambdaKeys[lambdaKeys.length - 1]) {
    lower = upper = lambdaNum;
  } else {
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
  }

  if (lower === null || !bendingData[lower]?.[pyKey] || !bendingData[upper]?.[pyKey]) {
    console.warn('Pb lookup failed for λ =', lambdaNum, 'and py =', pyKey);
    return null;
  }

  if (lower === upper) {
    return parseFloat(bendingData[lower][pyKey]);
  } else {
    const PbLower = parseFloat(bendingData[lower][pyKey]);
    const PbUpper = parseFloat(bendingData[upper][pyKey]);
    const interpolated = PbLower + ((lambdaNum - lower) / (upper - lower)) * (PbUpper - PbLower);
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
        lookupPc, // ✅
        lookupPb, // ✅
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => useContext(DesignContext);

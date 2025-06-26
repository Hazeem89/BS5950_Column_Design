import React, { createContext, useContext, useState } from 'react';
const DesignContext = createContext();

export const DesignProvider = ({ children }) => {
  const [designInputs, setDesignInputs] = useState({ Fc: '', Mx: '', My: '', grade: '', L: '' });
  const [selectedSection, setSelectedSection] = useState(null);
  const [classificationResults, setClassificationResults] = useState(null);
  const [capacityResults, setCapacityResults] = useState(null);
  const [bucklingResults, setBucklingResults] = useState(null);
  const [pcLookupResult, setPcLookupResult] = useState(null);
  const [PbLookupResult, setPbLookupResult] = useState(null);

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
        setPbLookupResult
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => useContext(DesignContext);
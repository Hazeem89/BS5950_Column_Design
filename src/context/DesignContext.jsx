import React, { createContext, useContext, useState } from 'react';
const DesignContext = createContext();

export const DesignProvider = ({ children }) => {
  const [designInputs, setDesignInputs] = useState({ Fc: '', Mx: '', My: '', grade: '', L: '' });
  const [selectedSection, setSelectedSection] = useState(null);
  const [classificationResults, setClassificationResults] = useState(null);
  const [capacityResults, setCapacityResults] = useState(null);

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
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => useContext(DesignContext);
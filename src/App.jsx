import React from 'react';
import { DesignProvider } from './context/DesignContext';
import InputDesignData from './components/InputDesignData/InputDesignData';
import SectionSelection from './components/SectionSelection/SectionSelection';
import SectionClassification from './components/SectionClassification/SectionClassification';
import PcLookup from './components/PcLookup/PcLookup';
import PbLookup from './components/PbLookup/PbLookup';
import LocalCapacityCheck from './components/LocalCapacityCheck/LocalCapacityCheck';
import OverallBucklingCheck from './components/OverallBucklingCheck/OverallBucklingCheck';

const App = () => {
  return (
    <DesignProvider>
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">BS5950 Column Design App</h1>
        <InputDesignData />
        <SectionSelection />
        <SectionClassification/>
        <LocalCapacityCheck />
        <PcLookup />
        <PbLookup/>
        <OverallBucklingCheck />
      </main>
    </DesignProvider>
  );
};

export default App;
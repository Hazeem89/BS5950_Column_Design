import React from "react";
import { DesignProvider } from "./context/DesignContext";
import InputDesignData from "./components/InputDesignData/InputDesignData";
import SectionSelection from "./components/SectionSelection/SectionSelection";
import SectionClassification from "./components/SectionClassification/SectionClassification";
import LocalCapacityCheck from "./components/LocalCapacityCheck/LocalCapacityCheck";
import OverallBucklingCheck from "./components/OverallBucklingCheck/OverallBucklingCheck";
import Lookup from "./components/Lookup/Lookup";

const App = () => {
  return (
    <DesignProvider>
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">BS5950 Column Design</h1>
        <InputDesignData />
        <SectionSelection />
        <SectionClassification />
        <LocalCapacityCheck />
        <Lookup/>
        <OverallBucklingCheck />
      </main>
    </DesignProvider>
  );
};

export default App;

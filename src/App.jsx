import React from "react";
import { DesignProvider } from "./context/DesignContext";
import InputDesignData from "./components/InputDesignData/InputDesignData";
import SectionSelection from "./components/SectionSelection/SectionSelection";
import SectionClassification from "./components/SectionClassification/SectionClassification";
import LocalCapacityCheck from "./components/LocalCapacityCheck/LocalCapacityCheck";
import OverallBucklingCheck from "./components/OverallBucklingCheck/OverallBucklingCheck";
import Lookup from "./components/Lookup/Lookup";
import AboutApp from "./components/AboutApp/AboutApp";

const App = () => {
  return (
    <DesignProvider>
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <header className="p-6 max-w-6xl mx-auto bg-[#fffac0] border border-gray-200 rounded-lg mb-6 shadow-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">
              BS5950_UC Section Design
            </h1>
            <AboutApp />
          </div>
        </header>
        <InputDesignData />
        <SectionSelection />
        <SectionClassification />
        <LocalCapacityCheck />
        <Lookup />
        <OverallBucklingCheck />
      </main>
    </DesignProvider>
  );
};

export default App;

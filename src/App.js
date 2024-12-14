import React, { useState, useEffect } from "react";
import Canvas3D from "./components/Canvas3D";
import Navbar from "./components/Navbar";
import SidePanel from "./components/SidePanel";
import SelectModelNotification from "./components/SelectModelNotification";
import { ModelProvider, useModel } from "./context/ModelContext";
import "./styles.css";

function AppContent() {
  const { selectedModel } = useModel();
  const [activePanel, setActivePanel] = useState(null);
  const [uvAspect, setUvAspect] = useState(null);

  const handleSelectTumbler = (panelKey) => {
    setActivePanel(panelKey);
  };

  const handleUvAspectChange = (aspect) => {
    setUvAspect(aspect);
    console.log('UV Unwrap Aspect Ratio:', aspect);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 relative">
        <SidePanel activePanel={activePanel} setActivePanel={setActivePanel} />
        <div className="flex-1 ml-64">
          {selectedModel ? (
            <Canvas3D onUvAspectChange={handleUvAspectChange} />
          ) : (
            <SelectModelNotification onSelectTumbler={handleSelectTumbler} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ModelProvider>
      <AppContent />
    </ModelProvider>
  );
}

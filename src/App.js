import React, { useState } from "react";
import Canvas3D from "./components/Canvas3D";
import Navbar from "./components/Navbar";
import SidePanel from "./components/SidePanel";
import TexturePreview from "./components/TexturePreview";
import SelectModelNotification from "./components/SelectModelNotification";
import { useModel, ModelProvider } from "./context/ModelContext";
import "./styles.css";

function AppContent() {
  const { selectedModel } = useModel();
  const [activePanel, setActivePanel] = useState(null);

  const handleSelectTumbler = (panelKey) => {
    setActivePanel(panelKey);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Left Panel - Higher z-index to ensure it's clickable */}
        <div style={{ 
          position: 'relative', 
          zIndex: 10,
          borderRight: '1px solid #ccc'
        }}>
          <SidePanel activePanel={activePanel} setActivePanel={setActivePanel} />
        </div>
        
        {/* Main Content Area */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '20px',
          gap: '20px',
          overflow: 'hidden',
          zIndex: 1
        }}>
          {/* Center - 3D View */}
          <div style={{ height: '45%' }}>
            {selectedModel ? (
              <Canvas3D />
            ) : (
              <SelectModelNotification onSelectTumbler={handleSelectTumbler} />
            )}
          </div>
          
          {/* Texture Preview - Centered and narrower */}
          {selectedModel && (
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              height: '45%'
            }}>
              <div style={{ 
                width: '300px', // Narrower width
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '20px',
                overflowY: 'auto'
              }}>
                <TexturePreview />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ModelProvider>
      <AppContent />
    </ModelProvider>
  );
}

export default App;

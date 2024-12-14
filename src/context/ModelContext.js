import React, { createContext, useState, useContext } from 'react';

const ModelContext = createContext();

export function ModelProvider({ children }) {
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedTexture, setSelectedTexture] = useState(null);
  const [textureScale, setTextureScale] = useState(1);
  const [uvDimensions, setUVDimensions] = useState(null);

  const setModelAndTexture = (model, isTexture = false) => {
    if (isTexture) {
      setSelectedTexture(model);
      setTextureScale(1);
    } else {
      setSelectedModel(model);
      setSelectedTexture(null);
    }
  };

  return (
    <ModelContext.Provider value={{ 
      selectedModel, 
      selectedTexture,
      textureScale,
      uvDimensions,
      setUVDimensions,
      setTextureScale,
      setModelAndTexture 
    }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
} 
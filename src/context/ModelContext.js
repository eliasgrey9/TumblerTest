import React, { createContext, useState, useContext } from 'react';

const ModelContext = createContext();

export function ModelProvider({ children }) {
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedTexture, setSelectedTexture] = useState(null);

  const setModelAndTexture = (model, isTexture = false) => {
    if (isTexture) {
      setSelectedTexture(model);
    } else {
      setSelectedModel(model);
      setSelectedTexture(null); // Reset texture when new model is selected
    }
  };

  return (
    <ModelContext.Provider value={{ 
      selectedModel, 
      selectedTexture,
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
// src/components/TextureScaler.js
import React from 'react';
import { useModel } from '../context/ModelContext';

const TextureScaler = ({ textureId }) => {
  const { selectedTexture, textureScale, setTextureScale, uvDimensions } = useModel();
  
  if (selectedTexture !== textureId || !uvDimensions) return null;

  // Calculate the base number of diamonds that fit in the UV space
  const calculateBaseCount = () => {
    const { width, height } = uvDimensions;
    const aspectRatio = width / height;
    
    // We want at least 24 diamonds to start
    const minDiamondsVertical = Math.ceil(Math.sqrt(24 / aspectRatio));
    const minDiamondsHorizontal = Math.ceil(minDiamondsVertical * aspectRatio);
    
    return {
      horizontal: minDiamondsHorizontal,
      vertical: minDiamondsVertical
    };
  };

  const baseCount = calculateBaseCount();
  const minScale = 1;
  const maxScale = 5;
  
  // Calculate valid steps based on UV dimensions
  const getValidSteps = () => {
    const steps = [];
    for (let i = minScale; i <= maxScale; i++) {
      const horizontalDiamonds = baseCount.horizontal * i;
      const verticalDiamonds = baseCount.vertical * i;
      steps.push({
        value: i,
        diamonds: horizontalDiamonds * verticalDiamonds
      });
    }
    return steps;
  };

  const validSteps = getValidSteps();

  return (
    <div className="mt-2">
      <input
        type="range"
        min={minScale}
        max={maxScale}
        step={1}
        value={textureScale}
        onChange={(e) => setTextureScale(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="text-sm text-gray-500 mt-1">
        Scale: {textureScale}x ({validSteps.find(s => s.value === textureScale)?.diamonds} diamonds)
      </div>
    </div>
  );
};

export default TextureScaler;
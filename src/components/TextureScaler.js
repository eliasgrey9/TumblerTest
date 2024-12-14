// src/components/TextureScaler.js
import React from 'react';
import { useModel } from '../context/ModelContext';

const TextureScaler = ({ textureId }) => {
  const { selectedTexture, textureScale, setTextureScale } = useModel();
  
  if (selectedTexture !== textureId) return null;

  return (
    <div className="mt-2">
      <input
        type="range"
        min="0.1"
        max="3"
        step="0.1"
        value={textureScale}
        onChange={(e) => setTextureScale(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="text-sm text-gray-500 mt-1">
        Scale: {textureScale.toFixed(1)}x
      </div>
    </div>
  );
};

export default TextureScaler;
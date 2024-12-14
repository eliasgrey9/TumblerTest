import React from "react";
import { useModel } from "../context/ModelContext";
import TextureScaler from "./TextureScaler";
import { exportScaledTexture } from "../utils/exportUtils";

export default function SecondaryPanel({ title, options, onClose }) {
  const { setModelAndTexture, selectedTexture, uvDimensions, textureScale } = useModel();

  const formatDisplayName = (option) => {
    return option.replace(/_/g, ' ');
  };

  const handleSelection = (option) => {
    setModelAndTexture(option, title === "Templates");
  };

  const handleExport = () => {
    if (selectedTexture && uvDimensions) {
      exportScaledTexture(selectedTexture, uvDimensions, textureScale);
    }
  };

  return (
    <div className="bg-gray-700 text-white w-64 h-full fixed left-64 top-0 shadow-lg z-50">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{title}</h2>
          <button 
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 rounded-full w-8 h-8 flex items-center justify-center text-2xl"
          >
            ×
          </button>
        </div>
        {title === "Templates" ? (
          <div className="grid grid-cols-1 gap-4">
            {options.map((option, index) => (
              <div key={index} className="space-y-2">
                <div 
                  className={`cursor-pointer transition-all ${
                    selectedTexture === option 
                      ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-700' 
                      : 'hover:opacity-80'
                  }`}
                  onClick={() => handleSelection(option)}
                >
                  <img 
                    src={`/images/${option}.jpg`} 
                    alt={formatDisplayName(option)}
                    className="w-full h-24 rounded-lg"
                  />
                  <p className="text-sm mt-2 text-center">
                    {formatDisplayName(option)}
                  </p>
                </div>
                {selectedTexture === option && (
                  <div className="space-y-2">
                    <TextureScaler textureId={option} />
                    <button
                      onClick={handleExport}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
                    >
                      Export SVG
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-4">
            {options.map((option, index) => (
              <li 
                key={index}
                className="bg-gray-600 hover:bg-gray-500 p-3 rounded-lg cursor-pointer transition-all"
                onClick={() => handleSelection(option)}
              >
                {formatDisplayName(option)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 
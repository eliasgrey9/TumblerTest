import React from "react";
import { useModel } from "../context/ModelContext";

export default function SecondaryPanel({ title, options, onClose }) {
  const { setModelAndTexture } = useModel();

  const formatDisplayName = (option) => {
    return option.replace(/_/g, ' ');
  };

  const handleSelection = (option) => {
    setModelAndTexture(option, title === "Templates");
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
              <div 
                key={index}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleSelection(option)}
              >
                <img 
                  src={`/images/${option}.jpg`} 
                  alt={formatDisplayName(option)}
                  className="w-full h-24 rounded-lg"
                />
                <p className="text-sm mt-2 text-center">{formatDisplayName(option)}</p>
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
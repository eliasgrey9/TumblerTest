import React from 'react';

export default function SelectModelNotification() {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="text-center p-8 rounded-lg bg-white shadow-lg">
        <svg 
          className="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M9 5h6a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2V7a2 2 0 012-2zm8 2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Model Selected</h2>
        <p className="text-gray-500">Please select a model from the sidebar to begin</p>
      </div>
    </div>
  );
} 
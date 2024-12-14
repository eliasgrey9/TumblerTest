import React, { useState } from "react";
import SecondaryPanel from "./SecondaryPanel";

export default function SidePanel() {
  const [activePanel, setActivePanel] = useState(null);

  const menuItems = {
    home: {
      title: "Home",
      options: ["Dashboard", "Analytics", "Reports"]
    },
    projects: {
      title: "Projects",
      options: ["Active Projects", "Archived", "Create New"]
    },
    templates: {
      title: "Templates",
      options: ["Smiley_Faces", "Leaves", "Smiley_Faces"]
    },
    polarCamels: {
      title: "Polar Camels",
      options: ["10_oz_Ringneck", "12_oz_Wine", "15_oz_Mug" , "20_oz_Ringneck", "30_oz_Ringneck"]
    }
  };

  function handleClick(key) {
    setActivePanel(activePanel === key ? null : key);
  }

  return (
    <div className="relative">
      <div className="bg-gray-800 text-white w-64 h-full fixed left-0">
        <div className="p-6">
          <button 
            onClick={() => handleClick('home')}
            className="w-full text-left mb-4 p-2 hover:bg-gray-700 rounded flex items-center"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>
          <button 
            onClick={() => handleClick('projects')}
            className="w-full text-left mb-4 p-2 hover:bg-gray-700 rounded flex items-center"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Projects
          </button>
          <button 
            onClick={() => handleClick('templates')}
            className="w-full text-left mb-4 p-2 hover:bg-gray-700 rounded flex items-center"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Templates
          </button>
          <button 
            onClick={() => handleClick('polarCamels')}
            className="w-full text-left mb-4 p-2 hover:bg-gray-700 rounded flex items-center"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 3h8a2 2 0 012 2v10a4 4 0 01-4 4H8a4 4 0 01-4-4V5a2 2 0 012-2zm10 4h2a2 2 0 012 2v2a2 2 0 01-2 2h-2v-6z"
              />
            </svg>
            Polar Camels
          </button>
        </div>
      </div>

      {activePanel && (
        <SecondaryPanel 
          title={menuItems[activePanel].title}
          options={menuItems[activePanel].options}
          onClose={() => setActivePanel(null)}
        />
      )}
    </div>
  );
} 
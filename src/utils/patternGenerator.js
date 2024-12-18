export const generateRepeatingPattern = (svg, scale, uvWidth, uvHeight) => {
  // Ignore incoming UV dimensions and use actual tumbler dimensions
  const scaleForDisplay = 800;
  
  // Force the correct dimensions regardless of UV input
  const textureWidth = 4.25 * scaleForDisplay;   // 4.25 inches
  const textureHeight = 11 * scaleForDisplay;    // 11 inches

  console.log('Forced Dimensions:', {
    textureWidth,
    textureHeight,
    ratio: textureWidth/textureHeight,
    expectedRatio: 4.25/11
  });

  // Calculate pattern size based on scale
  const patternSize = Math.min(textureWidth, textureHeight) / scale;

  return `
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="${textureWidth}" 
      height="${textureHeight}" 
      viewBox="0 0 ${textureWidth} ${textureHeight}"
    >
      <defs>
        <pattern 
          id="repeatingPattern" 
          x="0" 
          y="0" 
          width="${patternSize}" 
          height="${patternSize}" 
          patternUnits="userSpaceOnUse"
        >
          ${svg}
        </pattern>
      </defs>
      <rect 
        width="100%" 
        height="100%" 
        fill="url(#repeatingPattern)"
      />
    </svg>
  `;
};

export const calculatePatternDimensions = (uvWidth, uvHeight, scale) => {
  const scaleForDisplay = 800;
  
  // Force the correct dimensions here too
  const textureWidth = 4.25 * scaleForDisplay;
  const textureHeight = 11 * scaleForDisplay;
  
  const patternSize = Math.min(textureWidth, textureHeight) / scale;
  return {
    patternSize,
    patternsPerRow: textureWidth / patternSize,
    patternsPerColumn: textureHeight / patternSize
  };
}; 
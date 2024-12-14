export const createDiamondPattern = (uvDimensions, scale = 1) => {
  if (!uvDimensions) return null;
  
  const { width, height } = uvDimensions;
  const aspectRatio = width / height;
  
  // Calculate base number of diamonds that will fit in the smaller dimension
  const baseCount = Math.ceil(Math.sqrt(24));
  
  // Calculate horizontal and vertical counts while maintaining square diamonds
  const verticalCount = baseCount * scale;
  const horizontalCount = Math.ceil(verticalCount * aspectRatio);
  
  // Calculate a uniform diamond size based on the limiting dimension
  const uniformSize = Math.min(width / horizontalCount, height / verticalCount);
  
  // Log the dimensions
  console.log('UV Dimensions:', { width, height, aspectRatio });
  console.log('Diamond counts:', { horizontalCount, verticalCount });
  console.log('Uniform diamond size:', uniformSize);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="white"/>
      <defs>
        <pattern 
          id="diamondPattern" 
          width="${uniformSize}" 
          height="${uniformSize}" 
          patternUnits="userSpaceOnUse"
        >
          <path 
            d="M${uniformSize/2},0 L${uniformSize},${uniformSize/2} L${uniformSize/2},${uniformSize} L0,${uniformSize/2} Z" 
            fill="black"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diamondPattern)"/>
    </svg>
  `;

  return svg;
}; 
export const createDiamondPattern = (
  uvDimensions,
  geometryRatio,
  scale = 1,
) => {
  if (!uvDimensions) return null;
  
  const { width, height } = uvDimensions;
  const aspectRatio = width / height;
  
  // Calculate base number of diamonds that will fit in the smaller dimension
  const baseCount = Math.ceil(Math.sqrt(24));
  
  // Calculate counts using the geometry ratio to intentionally create squished diamonds
  const verticalCount = baseCount * scale;
  const horizontalCount = Math.ceil(verticalCount * aspectRatio);
  
 // Calculate diamond dimensions
  const diamondWidth = width / horizontalCount ;
  // Use inverse ratio to squish in the opposite direction
  const diamondHeight = (height / verticalCount) * (1 / geometryRatio);
  
  console.log('Pattern Generation:', {
    uvDimensions,
    geometryRatio,
    inverseRatio: 1/geometryRatio,
    aspectRatio,
    diamondDimensions: {
      width: diamondWidth,
      height: diamondHeight,
      squishFactor: 1/geometryRatio
    },
    counts: {
      horizontal: horizontalCount,
      vertical: verticalCount
    }
  });

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="white"/>
      <defs>
        <pattern 
          id="diamondPattern" 
          width="${diamondWidth}" 
          height="${diamondHeight}" 
          patternUnits="userSpaceOnUse"
        >
          <path 
            d="M${diamondWidth/2},0 
              L${diamondWidth},${diamondHeight/2} 
              L${diamondWidth/2},${diamondHeight} 
              L0,${diamondHeight/2} Z" 
            fill="black"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diamondPattern)"/>
    </svg>
  `;
  
  return svg;
};

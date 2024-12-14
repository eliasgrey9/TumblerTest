export const createDiamondPattern = (size = 100) => {
  // Create a diamond shape path
  const halfSize = size / 2;
  const path = `M${halfSize},0 L${size},${halfSize} L${halfSize},${size} L0,${halfSize} Z`;
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <pattern id="diamondPattern" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
          <path d="${path}" fill="#000000" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diamondPattern)" />
    </svg>
  `;
};

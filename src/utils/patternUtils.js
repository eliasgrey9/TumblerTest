import { useModel } from "../context/ModelContext";

function findValidCounts(ratio, maxCount = 20) {
	const validCombinations = [];
	// For each possible scale factor
	for (let scale = 1; scale <= maxCount; scale++) {
		// Calculate diamond dimensions at this scale
		const diamondWidth = ratio / scale;
		const diamondHeight = 1 / scale;
		// Calculate how many diamonds fit
		const xCount = Math.floor(1 / diamondWidth);
		const yCount = Math.floor(1 / diamondHeight);
		// Check if this creates a perfect fit
		const coverage = xCount * diamondWidth * (yCount * diamondHeight);
		if (Math.abs(coverage - 1) < 0.0001) {
			validCombinations.push({
				scale,
				xCount,
				yCount,
				totalShapes: xCount * yCount,
				diamondWidth: diamondWidth,
				diamondHeight: diamondHeight,
			});
		}
	}
	return validCombinations;
}

export const createDiamondPattern = (
	uvDimensions,
	geometryRatio,
	count,
	scale = 1,
) => {
	if (!uvDimensions) return null;
	const { width, height } = uvDimensions;

	const validCounts = findValidCounts(geometryRatio);
	if (!validCounts.length) return null; // Return null if no valid patterns found

	// Use the first valid combination
	console.log(count);
	const firstPattern = count;

	// Calculate actual diamond dimensions in UV space
	const diamondWidth = width / firstPattern.xCount;
	const diamondHeight = height / firstPattern.yCount;

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
            d="M${diamondWidth / 2},0 
              L${diamondWidth},${diamondHeight / 2} 
              L${diamondWidth / 2},${diamondHeight} 
              L0,${diamondHeight / 2} Z" 
            fill="black"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diamondPattern)"/>
    </svg>
  `;
	return svg;
};

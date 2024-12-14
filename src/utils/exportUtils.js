export const exportScaledPattern = async (uvDimensions, textureScale) => {
  if (!uvDimensions) return;

  try {
    const PIXELS_PER_INCH = 300;
    const canvasWidth = uvDimensions.width * PIXELS_PER_INCH;
    const canvasHeight = uvDimensions.height * PIXELS_PER_INCH;

    // Calculate pattern size based on scale
    const basePatternSize = 100;
    const scaledPatternSize = basePatternSize * textureScale;
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", canvasWidth);
    svg.setAttribute("height", canvasHeight);
    svg.setAttribute("viewBox", `0 0 ${canvasWidth} ${canvasHeight}`);

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
    pattern.setAttribute("id", "scaledDiamondPattern");
    pattern.setAttribute("width", scaledPatternSize);
    pattern.setAttribute("height", scaledPatternSize);
    pattern.setAttribute("patternUnits", "userSpaceOnUse");

    const halfSize = scaledPatternSize / 2;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M${halfSize},0 L${scaledPatternSize},${halfSize} L${halfSize},${scaledPatternSize} L0,${halfSize} Z`);
    path.setAttribute("fill", "#000000");

    pattern.appendChild(path);
    defs.appendChild(pattern);
    svg.appendChild(defs);

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", "url(#scaledDiamondPattern)");
    svg.appendChild(rect);

    const svgString = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `diamond_pattern_${textureScale}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error exporting pattern:', error);
  }
};
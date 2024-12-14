export const exportScaledTexture = async (textureId, uvDimensions, textureScale) => {
    if (!uvDimensions || !textureId) return;
  
    try {
      // Load the template image
      const img = new Image();
      img.src = `/images/${textureId}.jpg`;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });
  
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      // Use the exact unwrap dimensions
      const PIXELS_PER_INCH = 300;
      const canvasWidth = uvDimensions.width * PIXELS_PER_INCH;
      const canvasHeight = uvDimensions.height * PIXELS_PER_INCH;
  
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
  
      // Clear canvas
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      // Calculate the size of a single texture tile
      const tileWidth = canvasWidth / textureScale;
      const tileHeight = canvasHeight / textureScale;
  
      // Create temporary canvas for the base texture
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      tempCtx.drawImage(img, 0, 0);
  
      // Draw the texture in a repeating pattern matching Three.js RepeatWrapping
      for (let i = 0; i < textureScale; i++) {
          for (let j = 0; j < textureScale; j++) {
              ctx.drawImage(
                  img,
                  i * tileWidth,
                  j * tileHeight,
                  tileWidth,
                  tileHeight
              );
          }
      }
  
      // Create SVG
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", canvasWidth);
      svg.setAttribute("height", canvasHeight);
      svg.setAttribute("viewBox", `0 0 ${canvasWidth} ${canvasHeight}`);
      
      // Convert canvas to image data URL
      const scaledImageUrl = canvas.toDataURL('image/png');
  
      // Add the image to SVG
      const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
      image.setAttributeNS("http://www.w3.org/1999/xlink", "href", scaledImageUrl);
      image.setAttribute("width", "100%");
      image.setAttribute("height", "100%");
      
      svg.appendChild(image);
  
      // Create download
      const svgString = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${textureId}_scaled_${textureScale}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error('Error exporting texture:', error);
    }
  };

export const exportScaledPattern = async (uvDimensions, textureScale) => {
  if (!uvDimensions) return;

  try {
    const PIXELS_PER_INCH = 300;
    const canvasWidth = uvDimensions.width * PIXELS_PER_INCH;
    const canvasHeight = uvDimensions.height * PIXELS_PER_INCH;

    // Calculate pattern size based on scale
    const basePatternSize = 100; // Base size of diamond pattern
    const scaledPatternSize = basePatternSize * textureScale;
    
    // Create the main SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", canvasWidth);
    svg.setAttribute("height", canvasHeight);
    svg.setAttribute("viewBox", `0 0 ${canvasWidth} ${canvasHeight}`);

    // Create pattern definition
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
    pattern.setAttribute("id", "scaledDiamondPattern");
    pattern.setAttribute("width", scaledPatternSize);
    pattern.setAttribute("height", scaledPatternSize);
    pattern.setAttribute("patternUnits", "userSpaceOnUse");

    // Create diamond path
    const halfSize = scaledPatternSize / 2;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M${halfSize},0 L${scaledPatternSize},${halfSize} L${halfSize},${scaledPatternSize} L0,${halfSize} Z`);
    path.setAttribute("fill", "#000000");

    pattern.appendChild(path);
    defs.appendChild(pattern);
    svg.appendChild(defs);

    // Create background rectangle with pattern fill
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", "url(#scaledDiamondPattern)");
    svg.appendChild(rect);

    // Create download
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
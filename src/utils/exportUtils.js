export const exportScaledTexture = async (textureId, uvDimensions, textureScale) => {
  if (!uvDimensions || !textureId) return;

  try {
    // Load the template image
    const img = new Image();
    img.src = `/images/${textureId}.jpg`;
    
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    // Create a canvas to manipulate the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set fixed dimensions for UV unwrap
    const canvasWidth = 2048;
    const canvasHeight = 1024;

    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate base tile size
    const tileWidth = img.width;
    const tileHeight = img.height;

    // Calculate number of repetitions based on scale
    const repeatX = Math.ceil(canvasWidth * textureScale / tileWidth);
    const repeatY = Math.ceil(canvasHeight * textureScale / tileHeight);

    // Draw repeated pattern
    for (let x = 0; x < repeatX; x++) {
      for (let y = 0; y < repeatY; y++) {
        ctx.drawImage(
          img,
          x * (tileWidth / textureScale),
          y * (tileHeight / textureScale),
          tileWidth / textureScale,
          tileHeight / textureScale
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
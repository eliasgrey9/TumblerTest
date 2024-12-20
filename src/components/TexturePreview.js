import React, { useEffect, useRef, useState } from "react";
import { useModel } from "../context/ModelContext";
import { createDiamondPattern } from "../utils/patternUtils";

const TexturePreview = () => {
	const canvasRef = useRef(null);
	const [currentSvgString, setCurrentSvgString] = useState(null);
	const { uvDimensions, textureScale, geometryRatio, count } = useModel();

	const handleExportSvg = () => {
		if (!currentSvgString) return;

		// Create blob and download link
		const blob = new Blob([currentSvgString], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `diamond-pattern-${Date.now()}.svg`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	useEffect(() => {
		if (!uvDimensions || !canvasRef.current || !geometryRatio) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		console.log("TexturePreview Render:", {
			uvDimensions,
			geometryRatio,
			textureScale,
		});

		const drawPattern = async () => {
			try {
				let svgString = createDiamondPattern(
					uvDimensions,
					geometryRatio,
					count,
					textureScale,
				);

				if (!svgString) return;

				// Parse the SVG
				const parser = new DOMParser();
				const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
				const svgElement = svgDoc.documentElement;

				// Get the pattern element
				const patternElement = svgDoc.querySelector("pattern");

				// Adjust the pattern height by the geometry ratio
				const currentHeight = parseFloat(patternElement.getAttribute("height"));
				patternElement.setAttribute(
					"height",
					(currentHeight * geometryRatio).toString(),
				);

				// Also adjust the path within the pattern
				const pathElement = svgDoc.querySelector("path");
				const pathD = pathElement.getAttribute("d");
				const newD = pathD.replace(
					/L([^,]+),([^ ]+)/g,
					(match, x, y) => `L${x},${parseFloat(y) * geometryRatio}`,
				);
				pathElement.setAttribute("d", newD);

				// Adjust the SVG viewBox and dimensions
				const viewBox = svgElement.getAttribute("viewBox").split(" ");
				viewBox[3] = parseFloat(viewBox[3]) * geometryRatio;
				svgElement.setAttribute("viewBox", viewBox.join(" "));

				// Set explicit width and height on the SVG
				const scaleForExport = 1000; // Larger size for better quality
				svgElement.setAttribute(
					"width",
					(uvDimensions.width * scaleForExport).toString(),
				);
				svgElement.setAttribute(
					"height",
					(uvDimensions.height * scaleForExport * geometryRatio).toString(),
				);

				// Ensure preserveAspectRatio is set correctly
				svgElement.setAttribute("preserveAspectRatio", "none");

				// Convert back to string
				svgString = new XMLSerializer().serializeToString(svgDoc);
				setCurrentSvgString(svgString);

				const img = new Image();
				const blob = new Blob([svgString], { type: "image/svg+xml" });
				const url = URL.createObjectURL(blob);

				img.onload = () => {
					const scaleForDisplay = 400;
					canvas.width = uvDimensions.width * scaleForDisplay;
					canvas.height = uvDimensions.height * scaleForDisplay * geometryRatio;
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
					URL.revokeObjectURL(url);
				};
				img.src = url;
			} catch (error) {
				console.error("Error creating texture preview:", error);
			}
		};

		drawPattern();
	}, [uvDimensions, textureScale, geometryRatio, count]);

	return (
		<div style={{ textAlign: "center" }}>
			<h3 style={{ marginBottom: "10px" }}>Texture Preview</h3>
			<div
				style={{
					border: "1px solid #ccc",
					borderRadius: "4px",
					overflow: "hidden",
					width: "100%",
					position: "relative",
				}}
			>
				<canvas
					ref={canvasRef}
					style={{
						width: "100%",
						height: "100%",
						display: "block",
						objectFit: "fill",
					}}
				/>
			</div>
			<div
				style={{
					marginTop: "10px",
					fontSize: "0.9em",
					color: "#666",
				}}
			>
				<p>Scale: {textureScale}x</p>
				<p>Mesh UV Width: {uvDimensions?.width.toFixed(2)}</p>
				<p>Mesh UV Height: {uvDimensions?.height.toFixed(2)}</p>
				<p>Geometry Ratio: {geometryRatio?.toFixed(4)}</p>
				<button
					onClick={handleExportSvg}
					disabled={!currentSvgString}
					style={{
						marginTop: "10px",
						padding: "8px 16px",
						backgroundColor: currentSvgString ? "#4CAF50" : "#ccc",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: currentSvgString ? "pointer" : "not-allowed",
					}}
				>
					Export SVG
				</button>
			</div>
		</div>
	);
};

export default TexturePreview;

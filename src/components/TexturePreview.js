import React, { useEffect, useRef } from "react";
import { useModel } from "../context/ModelContext";
import { createDiamondPattern } from "../utils/patternUtils";

const TexturePreview = () => {
	const canvasRef = useRef(null);
	const { uvDimensions, textureScale, geometryRatio } = useModel();

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
				// Pass geometryRatio to pattern creation
				const svgString = createDiamondPattern(
					uvDimensions,
					geometryRatio,
					textureScale,
				);

				if (!svgString) return;
				const img = new Image();
				const blob = new Blob([svgString], { type: "image/svg+xml" });
				const url = URL.createObjectURL(blob);

				img.onload = () => {
					// Use the actual UV dimensions from the mesh
					const scaleForDisplay = 400;
					canvas.width = uvDimensions.width * scaleForDisplay;
					canvas.height = uvDimensions.height * scaleForDisplay;

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
	}, [uvDimensions, textureScale, geometryRatio]);

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
						height: "auto",
						display: "block",
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
			</div>
		</div>
	);
};

export default TexturePreview;

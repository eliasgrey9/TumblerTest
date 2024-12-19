// src/components/TextureScaler.js
import React from "react";
import { useModel } from "../context/ModelContext";

const TextureScaler = ({ textureId }) => {
	const {
		selectedTexture,
		textureScale,
		setTextureScale,
		uvDimensions,
		geometryRatio,
	} = useModel();

	if (selectedTexture !== textureId || !uvDimensions) return null;

	// Increased scale for larger display
	const scaleForDisplay = 800;
	const canvasWidth = uvDimensions.width * scaleForDisplay;
	const canvasHeight = uvDimensions.height * scaleForDisplay;

	console.log("Canvas Dimensions:", {
		canvasWidth,
		canvasHeight,
		geometryRatio,
	});

	const calculateBaseCount = () => {
		const aspectRatio = uvDimensions.width / uvDimensions.height;
		console.log("UV Aspect Ratio:", aspectRatio);

		// Base number of diamonds calculation
		const baseCount = Math.ceil(Math.sqrt(24));

		// Calculate counts using the geometry ratio for squished diamonds
		const verticalCount = baseCount;
		const horizontalCount = Math.ceil(verticalCount * aspectRatio);

		// Log the calculations for debugging
		console.log("Diamond Counts:", {
			baseCount,
			horizontal: horizontalCount,
			vertical: verticalCount,
			geometryRatio,
		});

		return {
			horizontal: horizontalCount,
			vertical: verticalCount,
		};
	};

	const baseCount = calculateBaseCount();
	const minScale = 1;
	const maxScale = 5;

	// Calculate valid steps based on UV dimensions and geometry ratio
	const getValidSteps = () => {
		const steps = [];
		for (let i = minScale; i <= maxScale; i++) {
			const horizontalDiamonds = baseCount.horizontal * i;
			const verticalDiamonds = baseCount.vertical * i;

			// Calculate actual diamond dimensions considering geometry ratio
			const diamondWidth = canvasWidth / horizontalDiamonds;
			const diamondHeight = (canvasHeight / verticalDiamonds) * geometryRatio;

			steps.push({
				value: i,
				diamonds: horizontalDiamonds * verticalDiamonds,
				dimensions: {
					width: diamondWidth,
					height: diamondHeight,
				},
			});
		}
		return steps;
	};

	const validSteps = getValidSteps();
	const currentStep = validSteps.find((s) => s.value === textureScale);

	return (
		<div className="mt-2" style={{ width: "100%", maxWidth: "800px" }}>
			<input
				type="range"
				min={minScale}
				max={maxScale}
				step={1}
				value={textureScale}
				onChange={(e) => setTextureScale(parseInt(e.target.value))}
				className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
			/>
			<div className="text-sm text-gray-500 mt-1">
				Scale: {textureScale}x ({currentStep?.diamonds} diamonds)
				{currentStep && (
					<div className="text-xs">
						Diamond size: {Math.round(currentStep.dimensions.width)}x
						{Math.round(currentStep.dimensions.height)} pixels
					</div>
				)}
			</div>
		</div>
	);
};

export default TextureScaler;

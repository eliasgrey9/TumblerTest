import React, { useMemo } from "react";
import { useModel } from "../context/ModelContext";

function findValidCounts(ratio, maxCount = 20) {
	const COVERAGE_MIN = 0.1001;
	const validCombinations = [];
	let index = 0; // Initialize index counter

	for (let scale = 1; scale <= maxCount; scale++) {
		const diamondWidth = ratio / scale;
		const diamondHeight = 1 / scale;
		const xCount = Math.floor(1 / diamondWidth);
		const yCount = Math.floor(1 / diamondHeight);
		const coverage = xCount * diamondWidth * (yCount * diamondHeight);
		if (Math.abs(coverage - 1) < COVERAGE_MIN) {
			validCombinations.push({
				index: index++, // Add and increment index
				scale,
				xCount,
				yCount,
				totalShapes: xCount * yCount,
				diamondWidth,
				diamondHeight,
			});
		}
	}
	return validCombinations;
}

const TextureScaler = ({ textureId }) => {
	const {
		selectedTexture,
		textureScale,
		setTextureScale,
		uvDimensions,
		geometryRatio,
		count,
		setCount,
	} = useModel();

	if (selectedTexture !== textureId || !uvDimensions) return null;

	// Increased scale for larger display
	const scaleForDisplay = 800;
	const canvasWidth = uvDimensions.width * scaleForDisplay;
	const canvasHeight = uvDimensions.height * scaleForDisplay;

	// Get valid combinations using memoization
	const validCombinations = useMemo(() => {
		return findValidCounts(geometryRatio, 100);
	}, [geometryRatio]);

	if (!validCombinations.length) {
		console.log("no valid combos");
		return null;
	}

	const minScale = 0;
	const maxScale = validCombinations.length - 1;

	const displayDimensions = {
		width: canvasWidth / count.xCount,
		height: canvasHeight / count.yCount,
	};

	const handleScaleChange = (e) => {
		const newScale = parseInt(e.target.value);
		setCount(validCombinations[newScale]);
	};

	return (
		<div className="mt-2" style={{ width: "100%", maxWidth: "800px" }}>
			<input
				type="range"
				min={minScale}
				max={maxScale}
				step={1}
				value={count.index}
				onChange={handleScaleChange}
				className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
			/>
			<div className="text-sm text-gray-500 mt-1">
				Scale: {textureScale}x ({count.xCount}x{count.yCount} ={" "}
				{count.totalShapes} diamonds)
				<div className="text-xs">
					Diamond size: {Math.round(displayDimensions.width)}x
					{Math.round(displayDimensions.height)} pixels
				</div>
			</div>
		</div>
	);
};

export default TextureScaler;

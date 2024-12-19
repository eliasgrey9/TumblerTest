import React, { createContext, useState, useContext } from "react";

const ModelContext = createContext();

export function ModelProvider({ children }) {
	const [selectedModel, setSelectedModel] = useState(null);
	const [selectedTexture, setSelectedTexture] = useState(null);
	const [textureScale, setTextureScale] = useState(1);
	const [uvDimensions, setUVDimensions] = useState(null);
	const [geometryRatio, setGeometryRatio] = useState(1);

	const setModelAndTexture = (model, isTexture = false) => {
		if (isTexture) {
			setSelectedTexture(model);
			setTextureScale(8);
		} else {
			setSelectedModel(model);
			setSelectedTexture(null);
			setTextureScale(1);
		}
	};

	return (
		<ModelContext.Provider
			value={{
				selectedModel,
				selectedTexture,
				textureScale,
				uvDimensions,
				geometryRatio,
				setUVDimensions,
				setTextureScale,
				setModelAndTexture,
				setGeometryRatio,
			}}
		>
			{children}
		</ModelContext.Provider>
	);
}

export function useModel() {
	const context = useContext(ModelContext);
	if (!context) {
		throw new Error("useModel must be used within a ModelProvider");
	}
	return context;
}

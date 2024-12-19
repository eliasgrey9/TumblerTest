import React, { useRef, useEffect } from "react";
import { suspend } from "suspend-react";
import { useLoader, useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useModel } from "../context/ModelContext";
import { createDiamondPattern } from "../utils/patternUtils";

const createSvgTexture = (svgString, size = 512) => {
	return new Promise((resolve) => {
		const canvas = document.createElement("canvas");
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext("2d");

		const img = new Image();
		const blob = new Blob([svgString], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);

		img.onload = () => {
			ctx.drawImage(img, 0, 0, size, size);
			const texture = new THREE.CanvasTexture(canvas);
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.needsUpdate = true;

			URL.revokeObjectURL(url);
			resolve(texture);
		};

		img.onerror = (err) => {
			console.error("Error loading SVG:", err);
			URL.revokeObjectURL(url);
		};

		img.src = url;
	});
};

const calculateGeometryDimensions = (geometry) => {
	const positions = geometry.attributes.position;
	let minX = Infinity,
		maxX = -Infinity;
	let minY = Infinity,
		maxY = -Infinity;
	let minZ = Infinity,
		maxZ = -Infinity;

	for (let i = 0; i < positions.count; i++) {
		const x = positions.array[i * 3];
		const y = positions.array[i * 3 + 1];
		const z = positions.array[i * 3 + 2];

		minX = Math.min(minX, x);
		maxX = Math.max(maxX, x);
		minY = Math.min(minY, y);
		maxY = Math.max(maxY, y);
		minZ = Math.min(minZ, z);
		maxZ = Math.max(maxZ, z);
	}

	return {
		width: maxX - minX,
		height: maxY - minY,
		depth: maxZ - minZ,
	};
};

const Scene = ({ onUvAspectChange }) => {
	const objRef = useRef();
	const previousModelRef = useRef(null);
	const {
		selectedModel,
		selectedTexture,
		textureScale,
		uvDimensions,
		geometryRatio,
		setUVDimensions,
		setGeometryRatio,
	} = useModel();
	const { invalidate } = useThree();

	const obj = useLoader(
		OBJLoader,
		`http://localhost:3001/images/${selectedModel}.obj`,
	);

	console.log(
		"Loading model from:",
		`http://localhost:3001/images/${selectedModel}.obj`,
	);

	useEffect(() => {
		if (obj) {
			obj.traverse((child) => {
				if (child.isMesh) {
					const geometry = child.geometry;
					const uvAttribute = geometry.attributes.uv;
					const geometryDimensions = calculateGeometryDimensions(geometry);
					const newGeometryRatio =
						geometryDimensions.width / geometryDimensions.height;
					console.log(newGeometryRatio);
					setGeometryRatio(newGeometryRatio);

					if (uvAttribute) {
						let minU = Infinity,
							maxU = -Infinity;
						let minV = Infinity,
							maxV = -Infinity;

						for (let i = 0; i < uvAttribute.count; i++) {
							const u = uvAttribute.array[i * 2];
							const v = uvAttribute.array[i * 2 + 1];

							minU = Math.min(minU, u);
							maxU = Math.max(maxU, u);
							minV = Math.min(minV, v);
							maxV = Math.max(maxV, v);
						}

						const width = maxU - minU;
						const height = maxV - minV;

						setUVDimensions({ width, height });
					}
				}
			});
		}
	}, [obj, setUVDimensions, setGeometryRatio]);

	useEffect(() => {
		if (obj && selectedTexture && uvDimensions) {
			const applyTextureToMesh = async (texture) => {
				obj.traverse((child) => {
					if (child.isMesh) {
						console.log("Applying materials to mesh:", child.name);
						const geometry = child.geometry;

						// Flip normals if needed
						for (let i = 0; i < geometry.attributes.position.count; i++) {
							geometry.attributes.normal.array[i * 3] *= -1;
							geometry.attributes.normal.array[i * 3 + 1] *= -1;
							geometry.attributes.normal.array[i * 3 + 2] *= -1;
						}
						geometry.attributes.normal.needsUpdate = true;

						// Create two materials: one with texture, one without
						const texturedMaterial = new THREE.MeshStandardMaterial({
							color: 0xffffff,
							map: texture,
							side: THREE.FrontSide,
							metalness: 0.1,
							roughness: 0.8,
						});

						const plainMaterial = new THREE.MeshStandardMaterial({
							color: 0xffffff,
							side: THREE.FrontSide,
							metalness: 0.1,
							roughness: 0.8,
						});

						const insideMaterial = new THREE.MeshStandardMaterial({
							color: 0xffffff,
							side: THREE.BackSide,
							metalness: 0.1,
							roughness: 0.5,
						});

						// Log UV coordinates for debugging
						const uv = geometry.attributes.uv;
						// console.log("UV Coordinates Range:");
						let minU = Infinity,
							maxU = -Infinity;
						let minV = Infinity,
							maxV = -Infinity;

						for (let i = 0; i < uv.count; i++) {
							const u = uv.array[i * 2];
							const v = uv.array[i * 2 + 1];
							minU = Math.min(minU, u);
							maxU = Math.max(maxU, u);
							minV = Math.min(minV, v);
							maxV = Math.max(maxV, v);
						}
						// console.log(`U range: ${minU} to ${maxU}`);
						// console.log(`V range: ${minV} to ${maxV}`);

						// Apply materials based on UV coordinates
						// Adjust these values based on the logged UV ranges
						const patternArea = {
							minU: 0.0,
							maxU: 0.5,
							minV: 0.0,
							maxV: 0.5,
						};

						// Create groups for different materials
						const vertexCount = geometry.attributes.position.count;
						const patternIndices = [];
						const plainIndices = [];

						// Group vertices based on their UV coordinates
						for (let i = 0; i < vertexCount; i += 3) {
							const u1 = uv.array[i * 2];
							const v1 = uv.array[i * 2 + 1];

							if (
								u1 >= patternArea.minU &&
								u1 <= patternArea.maxU &&
								v1 >= patternArea.minV &&
								v1 <= patternArea.maxV
							) {
								patternIndices.push(i, i + 1, i + 2);
							} else {
								plainIndices.push(i, i + 1, i + 2);
							}
						}

						// Apply materials
						child.material = [texturedMaterial, plainMaterial, insideMaterial];
						child.material.needsUpdate = true;
					}
				});
				invalidate();
			};

			const loadTexture = async () => {
				try {
					const svgString = createDiamondPattern(
						uvDimensions,
						geometryRatio,
						textureScale,
					);
					const texture = await createSvgTexture(svgString);
					await applyTextureToMesh(texture);
				} catch (error) {
					console.error("Error loading texture:", error);
				}
			};

			loadTexture();
		}
	}, [
		obj,
		selectedTexture,
		textureScale,
		uvDimensions,
		invalidate,
		geometryRatio,
	]);

	return (
		<group>
			<ambientLight intensity={0.5} />
			<directionalLight position={[10, 10, 5]} intensity={1} />
			<directionalLight position={[-10, -10, -5]} intensity={0.5} />
			<OrbitControls />
			<primitive
				ref={objRef}
				object={obj}
				scale={45}
				position={[-0.1, -3, -1]}
			/>
		</group>
	);
};

export default Scene;
